#!/usr/bin/env python3

'''
Quick and dirty code to exchange APDUs between Ledger Live Speculos APDU server.

Usage example:

  export DEBUG_COMM_HTTP_PROXY='http://127.0.0.1:9998'
  ledger-live getAccount -c btc --path "m/49'/0'/0'/0/0" --derivationMode segwit
'''

import argparse
import binascii
import json
import http.server
import socketserver
import socket
import sys
from ledgerblue.comm import getDongle

HOST = '127.0.0.1'
PORT = 7777


def _recvall(s, size):
    data = b''
    while size > 0:
        tmp = s.recv(size)
        if len(tmp) == 0:
            print("[-] apduthread: connection with client closed", file=sys.stderr)
            return None
        data += tmp
        size -= len(tmp)
    return data


class SimpleHTTPRequestHandler(http.server.BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        self.send_header("Access-Control-Allow-Methods", "GET, POST")
        self.end_headers()

    def do_POST(self):
        dongle = getDongle(True)
        # get APDU from the request body
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        apdu = json.loads(body)
        apdu = binascii.unhexlify(apdu['apduHex'])
        print('<', binascii.hexlify(apdu))

        result = dongle.exchange(bytearray(apdu))
        print('>', binascii.hexlify(result))

        # forward the APDU response to the client, embedded in response body
        data = {'data': str(binascii.hexlify(result), 'ascii') + '9000', 'error': None} # also append success status (0x9000)
        data = json.dumps(data)
        data = data.encode('ascii')

        self.send_response(200)
        self.send_header('Content-Length', len(data))
        self.send_header('Content-Type', 'application/json')
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data)
        dongle.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run one or more QEMU instances given the config files passed as '
                                                 'arguments. The -c/--config argument can be passed several times '
                                                 '(please note that the arguments order matters.)')
    parser.add_argument('-p', '--port', default=PORT, help='APDU server port')
    parser.add_argument('-v', '--verbose', action='store_true')
    args = parser.parse_args()

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((HOST, PORT), SimpleHTTPRequestHandler) as httpd:
        print("serving at port", PORT)
        httpd.serve_forever()
