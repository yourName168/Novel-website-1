- Tạo package.json:
        npm init
1. Cách fix lỗi xung đột port
*) Nguyên nhân:
- Khi sử dụng một port mà đã được sử dụng bởi một phần mềm khác
*) Cách giải quyết: kill port
    https://stackoverflow.com/questions/39632667/how-do-i-remove-the-process-currently-using-a-port-on-localhost-in-windows
2. Tạo server bằng express.js
- Được xây dựng dựa trên nodejs
3. config NodeJS Typescript Eslint
- ESlint giúp chuẩn hóa code
*) Cấu trúc dự án:
- dist: Chứa code được build từ TS sang JS
- src: chứa source code chính(TS):
    + constants: chứa những hằng số
    + controller: chứa những xử lý logic của dự án
    + middlewares: chứa những xử lý trung gian
    + models: chứa các  file model
    + routes: chứa những quy định về các tuyền đường cho api
    + services: gọi API các xử lý liên quan
    + utils: chứa những hàm dùng lại nhiều lần
    + index.ts: file tổng
    + type.d.ts: khai báo kiểu dữ liệu thêm

- Cách cài đặt: https://duthanhduoc.com/blog/setup-du-an-nodejs-typescript