
    => Chạy npm i để tải các thư viện về trước.
    => npm start để khởi động ứng dụng.
    => Dùng axios để kết nối api: Import api vào.
    => Vì api đã có urlBase sẵn là http://localhost:3000/ .Nên chỉ cần nối thêm url thôi.
    => Các component cần thiết sẽ tạo ở trong folder components.
    => Các page đã được tạo sẵn ở trong folder pages. 
       Chỉ cần vào folder page tương ứng với page được phân công -> index.js và code trong đấy
    => Nếu cần file css thì tạo trong folder page đó luôn, với định dạng là <Tên page>.css
    => Các layout và router đã được viết sẵn. Code các component trong page là được.
    => Hình ảnh và các icon sẽ được lưu trong folder assets
    => Folder redux sẽ có các action như login và logout. Nếu kết nối api đăng nhập thì thêm dùng
       dispatcher để lưu thông tin người dùng vào localStorage.
    => Nếu cần thêm font mới thì cứ thêm vào file base.css.
    => Nhớ phân nhánh git và không được đẩy code lên main.
    => Trong page setting chứa các page update-information, ....