import "./LeftComponentDefault.css";

function LeftLayout(props) {
    const {title, content} = props;
    return (
        <>
            <div className="container-left-default">
                <h1 className="title-left-default">{title}</h1>
                <h2 className="content-left-default">{content}</h2>
            </div>
        </>
    );
}

export default LeftLayout;