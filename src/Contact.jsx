import { useState } from 'react';

const contactEmail = import.meta.env.VITE_CONTACTO_CORREO?.trim() || 'axelsalgado.ng@academia.umb.edu.co';

export default function Contact() {
  const [status, setStatus] = useState('');

  function prepareMessage(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const subject = fields.get('asunto').trim();
    const message = `Nombre: ${fields.get('nombre').trim()}\nCorreo: ${fields.get('correo').trim()}\n\n${fields.get('mensaje').trim()}`;

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    setStatus('Revisa y envia el borrador desde tu aplicacion de correo.');
  }

  return (
    <section className="catalog contact" aria-labelledby="page-title">
      <div>
        <h1 id="page-title" tabIndex={-1}>Contacto</h1>
        <p className="contact-intro">Dejanos tus preguntas sobre la coleccion, la exhibicion 3D o el proyecto.</p>
        <a className="contact-email" href={`mailto:${contactEmail}`}>{contactEmail}</a>
        <p className="contact-note" id="contact-note">
          El formulario prepara un correo para que lo revises y envies desde tu aplicacion.
        </p>
      </div>
      <form className="contact-form" aria-describedby="contact-note" onSubmit={prepareMessage} onChange={() => setStatus('')}>
        <label>Nombre<input name="nombre" autoComplete="name" maxLength={80} required /></label>
        <label>Correo<input name="correo" type="email" autoComplete="email" maxLength={160} required /></label>
        <label>Asunto<input name="asunto" maxLength={100} required /></label>
        <label>Mensaje<textarea name="mensaje" rows="5" maxLength={1000} required /></label>
        <button type="submit" className="catalog-button">Preparar correo</button>
        <p role="status">{status}</p>
      </form>
    </section>
  );
}
