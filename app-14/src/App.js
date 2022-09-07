import React from 'react'
import {firebase} from './firebase.js'

function App() {
  const [nombre, setNombre]=React.useState('')
  const [apellido, setApellido]=React.useState('')
  const [id, setId]=React.useState('')
  const [lista, setLista]=React.useState([])
  const [error, setError]=React.useState(null)
  const [modoEdicion,setModoEdicion]=React.useState(false)
  React.useEffect(()=>{
    const obtenerDatos=async()=>{
      try{
      const db=firebase.firestore()
      const data=await db.collection('crudfire').get()
      const arrayData=data.docs.map((doc)=>({id:doc.id,...doc.data()}))
      setLista(arrayData)
      }catch (error){
        console.log(error)
      }
    }
    obtenerDatos()
  },[])

  //Guardar datos
  const guardarDatos=async(e)=>{
    e.preventDefault()
    if(!nombre.trim()){
      setError('Ingrese el Nombre')
      return
    }
    if(!apellido.trim()){
      //alert ('Ingrese el Apellido')
      setError ('Ingrese el Apellido')
      return
    }
    //console.log("registrando: "+nombre+" "+apellido)
    //registrar en firebase
    try{
      const db=firebase.firestore()
      const nuevoUsuario={
        nombre,apellido
      }
      const dato=await db.collection('crudfire').add(nuevoUsuario)
      setLista([
        ...lista,
        {...nuevoUsuario,id:dato.id}
      ])
    }catch{}
    setLista([...lista,
      {id,nombre,apellido}
    ])
    //limpiar Inputs
    e.target.reset()
    //limpiar cajas de texto
    setNombre('')
    setApellido('')
    //limpiar error
    setError(null)
  }
  
//ELIMINARRRRRRR
  const eliminar=async(id)=>{
    if(modoEdicion){
      setError('Primero termina de editar')
    }
    try{
      const db=firebase.firestore()
      await db.collection('crudfire').doc(id).delete()
      const listaFiltrada=lista.filter((elemento)=>elemento.id!==id)
      setLista(listaFiltrada)
    } catch (error) {
    console.log(error)
    }
    
  }
//EDITARRRRRRRR  
  const editar=(elemento)=>{
    setModoEdicion(true)
    setNombre(elemento.nombre)
    setApellido(elemento.apellido)
    setId(elemento.id)
  }
  //Editar usuario
  const editarDatos=async(e)=>{
    e.preventDefault()
    if(!nombre.trim()){
      setError('Ingrese el Nombre')
      return
    }
    if(!apellido.trim()){
      //alert ('Ingrese el Apellido')
      setError ('Ingrese el Apellido')
      return
    }
    //console.log("registrando: "+nombre+" "+apellido)
    try{
      const db=firebase.firestore()
      await db.collection('crudfire').doc(id).update({
      nombre,apellido})
      const listaEditada=lista.map(
      (elemento)=>elemento.id===id ?
      {id:id,nombre:nombre,apellido:apellido} :elemento)
      setLista(listaEditada)//listando nuevos valores 
      setModoEdicion(false)
      setNombre('')
      setApellido('')
      setId('')
      setError(null)
    }
    catch(error){
      console.log(error)
    }
    //limpiar Inputs
    e.target.reset()
    //limpiar cajas de texto
    setNombre('')
    setApellido('')
    //limpiar error
    setError(null)
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h4 className="text-center">
            {
            modoEdicion ? "Editar Usuario":"Agregar Usuario"
            }</h4>
          <form onSubmit={modoEdicion ? editarDatos:guardarDatos}>
            {
              error ?(
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ):null
            }
            <input type="text"
            placeholder="Ingrese Nombre"
            className="form-control mb-3"
            onChange={(e)=>{setNombre(e.target.value)
            if(error === 'Ingrese el Nombre'|| error==='Primero termina de editar'){
              setError(null)
            }}}
            value={nombre}
             />
            <input type="text"
            placeholder="Ingrese Apellido"
            className="form-control mb-3"
            onChange={(e)=>{setApellido(e.target.value)
            if(error==='Ingrese el Apellido'|| error==='Primero termina de editar'){
              setError(null)
            }}}
            value={apellido}
             />
             <div className="d-grid  gap-2">
               {
                modoEdicion ? (<button className="btn btn-secondary" type="submit">Editar Usuario</button>) : (<button className="btn btn-primary" type="submit">Resgistrar Usuario</button>)
               } 
             </div>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
            <h4 className="text-center"> Lista de Usuario</h4>
            <ul className="list-group">
              {
                lista.map((elemento)=>(
                  <li key={elemento.id} className="list-group-item">
                    {elemento.nombre} {elemento.apellido}
                    <button className="btn btn-danger float-end mx-2"onClick={()=>eliminar(elemento.id)}>Eliminar</button>
                    <button className="btn btn-success float-end mx-2" onClick={()=>editar(elemento)}>Editar</button> 
                  </li>
                ))
              }
            </ul>
        </div>
      </div>
    </div>
  );
}

export default App;