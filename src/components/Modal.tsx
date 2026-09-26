function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-wrapper">{children}</div>
    </div>
  )
}

function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className="modal-header">{children}</div>
}

function ModalContent({ children }: { children: React.ReactNode }) {
  return <div className="modal-content">{children}</div>
}

function ModalFooter({children} : {children:React.ReactNode}){
    return <div className="modal-footer">{children}</div>
}



Modal.Header = ModalHeader
Modal.Content = ModalContent
Modal.Footer = ModalFooter

export default Modal
