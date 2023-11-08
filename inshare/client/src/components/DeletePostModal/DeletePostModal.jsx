import { Modal, Button } from 'react-bootstrap';

function DeletePostModal({ post, onDelete, onClose }) {
    return (
        <Modal show={!!post} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the post: "<b>{post?.heading}</b>"?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={() => onDelete(post?._id)}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeletePostModal;
