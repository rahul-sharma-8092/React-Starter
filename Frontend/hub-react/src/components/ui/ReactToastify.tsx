import { ToastContainer } from "react-toastify";

function ReactToatify() {
    return (
        <ToastContainer
            position='top-right'
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
        />
    );
}

export default ReactToatify;
