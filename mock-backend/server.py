from http.server import SimpleHTTPRequestHandler, HTTPServer
import json, os

class TodoHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.end_headers()

    def do_GET(self):
        if self.path == '/todos' or self.path == '/todos.json':
            try:
                with open('todos.json', 'r') as f:
                    todos = f.read()
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(todos.encode())
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/todos':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_todo = json.loads(post_data)
            try:
                with open('todos.json', 'r+') as f:
                    todos = json.load(f)
                    new_todo['id'] = max([t['id'] for t in todos] + [0]) + 1
                    todos.append(new_todo)
                    f.seek(0)
                    json.dump(todos, f, indent=2)
                    f.truncate()
                self.send_response(201)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(new_todo).encode())
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(__file__))
    server = HTTPServer(('localhost', 5000), TodoHandler)
    print('Serving on http://localhost:5000')
    server.serve_forever() 