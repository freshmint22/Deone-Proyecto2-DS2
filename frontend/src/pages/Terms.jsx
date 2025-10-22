import React from 'react';
import './terms.css';

const sections = [
  {title: '1. Aceptación de los términos', body: 'Al acceder o utilizar la plataforma DeOne, el usuario acepta cumplir con los presentes Términos y Condiciones de Uso, así como con la Política de Privacidad correspondiente. Si no está de acuerdo con alguno de los puntos aquí descritos, deberá abstenerse de utilizar la aplicación.'},
  {title: '2. Descripción del servicio', body: 'DeOne es una plataforma web desarrollada con fines académicos en la Universidad del Valle, que facilita la conexión entre estudiantes y comercios del campus para realizar pedidos de productos y servicios de manera rápida, organizada y digital. La plataforma no es responsable directa de las transacciones económicas o de los productos ofrecidos, ya que actúa únicamente como intermediario tecnológico.'},
  {title: '3. Registro y uso de cuentas', body: 'Solo pueden registrarse estudiantes, docentes, trabajadores y comercios del campus que cuenten con un correo institucional válido. Los usuarios son responsables de la veracidad de la información registrada y del uso adecuado de sus credenciales de acceso. Está prohibido crear cuentas falsas, compartir contraseñas o utilizar la plataforma con fines distintos a los académicos o comerciales autorizados.'},
  {title: '4. Responsabilidad de los usuarios', body: 'Los usuarios se comprometen a utilizar la aplicación de forma ética y respetuosa, no alterar, dañar o interferir con el funcionamiento de la plataforma, no publicar ni distribuir contenido ofensivo, fraudulento o ilegal, y respetar las normas de convivencia y propiedad de los comercios. El incumplimiento de estas condiciones puede conllevar la suspensión o eliminación de la cuenta.'},
  {title: '5. Responsabilidad de los comercios', body: 'Los comercios que usen DeOne deberán mantener actualizada la información de sus productos, precios e inventarios, cumplir con los pedidos aceptados en los tiempos acordados y responder ante cualquier reclamo derivado de los productos o servicios ofrecidos. DeOne no se hace responsable por errores en los pedidos, precios o disponibilidad de productos registrados por los comercios.'},
  {title: '6. Pagos y transacciones', body: 'En caso de que se integren métodos de pago digitales (Nequi, Daviplata, PSE u otros), estos serán gestionados externamente por las plataformas correspondientes. DeOne no almacena información financiera ni procesa directamente pagos.'},
  {title: '7. Privacidad y tratamiento de datos', body: 'DeOne recopila únicamente la información necesaria para el funcionamiento de la plataforma: nombre, correo institucional y datos mínimos del perfil o comercio. Los datos personales serán tratados conforme a la Ley 1581 de 2012 (Colombia) sobre protección de datos personales. Los usuarios pueden solicitar la eliminación de su cuenta o datos en cualquier momento.'},
  {title: '8. Limitación de responsabilidad', body: 'DeOne no garantiza disponibilidad continua del servicio, ya que es un proyecto académico en desarrollo. No se responsabiliza por fallas técnicas, pérdida de información o errores causados por factores externos. Los desarrolladores no asumen responsabilidad por mal uso de la plataforma por parte de terceros.'},
  {title: '9. Propiedad intelectual', body: 'El código, diseño y funcionalidades de DeOne son propiedad del equipo desarrollador y tienen fines educativos. El uso de la aplicación no otorga ningún derecho de propiedad intelectual a los usuarios.'},
  {title: '10. Modificaciones a los términos', body: 'DeOne podrá actualizar estos Términos y Condiciones en cualquier momento. Los cambios serán publicados dentro de la plataforma, y el uso continuado implicará aceptación de las modificaciones.'},
  {title: '11. Contacto', body: 'Para consultas, reclamos o solicitudes relacionadas con el uso de la plataforma, los usuarios pueden comunicarse a: soporte.deone@correounivalle.edu.co'}
];

export default function Terms(){
  return (
    <div className="terms-page">
      <div className="terms-inner">
        <h1>🧾 TÉRMINOS Y CONDICIONES DE USO – DeOne</h1>
        <p className="updated">Última actualización: Octubre de 2025</p>

        <div className="terms-grid">
          {sections.map((s,idx)=> (
            <article key={idx} className="term-card">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
