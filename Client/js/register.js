const registerHandler = async (fullname, email, password, confirm_password) => {
    try {
        const result = await fetch("http://localhost:3535/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: fullname,
                email,
                password,
                confirm_password
            })
        });
        const data = await result.json();
        console.log(data);
        return data; // Trả về dữ liệu từ máy chủ
    } catch (error) {
        console.error('Error:', error);
    }
};
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Ngăn chặn việc gửi form mặc định

        const fullname = form.elements['fullname'].value;
        const email = form.elements['email'].value;
        const password = form.elements['password'].value;
        const confirm_password = form.elements['confirm_password'].value;

        // Kiểm tra mật khẩu có đủ mạnh không
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert('Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.');
            return;
        }

        // Kiểm tra mật khẩu và xác nhận mật khẩu có giống nhau không
        if (password !== confirm_password) {
            alert('Mật khẩu và xác nhận mật khẩu không giống nhau!');
            return;
        }

        // Gọi hàm registerHandler để gửi yêu cầu đăng ký
        const result = await registerHandler(fullname, email, password, confirm_password);

        if (result && result.err && result.err.email) {
            alert('Email đã tồn tại!'); // Hiển thị thông báo khi email đã tồn tại
        }
        
        if(result.message==='register success!'){
            alert("Chúc mừng đã tạo tài khoản thành công!");
            localStorage.setItem("access_token", result.result.access_token);
            localStorage.setItem("refresh_token", result.result.refresh_token);
            window.location.href = "./login.html";
        }
    });
});
