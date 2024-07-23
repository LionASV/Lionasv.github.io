import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

function App() {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [autos, setAutos] = useState([]);
  const [indexEdit, setIndiceEdicion] = useState(null);

  useEffect(() => {
    const AutoStorage = JSON.parse(localStorage.getItem('autos')) || [];
    setAutos(AutoStorage);
  }, []);

  const onSubmit = (data) => {
    const AutosGuardados = JSON.parse(localStorage.getItem('autos')) || [];

    // Validar si el auto ya existe en el almacenamiento local
    const existe = AutosGuardados.some(auto => auto.patente === data.patente);

    if (indexEdit !== null) {
      if (existe && AutosGuardados[indexEdit].patente !== data.patente) {
        alert('La patente ya existe. Por favor, ingrese una patente diferente.');
        return;
      }
      AutosGuardados[indexEdit] = data;
    } else {
      if (existe) {
        alert('La patente ya existe. Por favor, ingrese una patente diferente.');
        return;
      }
      AutosGuardados.push(data);
    }

    localStorage.setItem('autos', JSON.stringify(AutosGuardados));
    setAutos(AutosGuardados);
    setIndiceEdicion(null);
    reset(); 
  };

  const validarFecha = (value) => {
    const hoy = new Date();
    const fechaInput = new Date(value);

    if (fechaInput > hoy) {
      return 'La fecha de creación no puede ser futura.';
    }
    return true;
  };

  const validarPatente = (value) => {
    const patenteRegex = /^[A-Za-z]{2}[0-9]{4}$/;
    if (!patenteRegex.test(value)) {
      return 'La patente debe tener el formato correcto (dos letras seguidas de cuatro números, por ejemplo, AB1234).';
    }
    return true;
  };

  const handleEditar = (index) => {
    const auto = autos[index];
    for (const key in auto) {
      setValue(key, auto[key]);
    }
    setIndiceEdicion(index);
  };

  const handleEliminar = (index) => {
    const autosAlmacenados = JSON.parse(localStorage.getItem('autos')) || [];
    autosAlmacenados.splice(index, 1);
    localStorage.setItem('autos', JSON.stringify(autosAlmacenados));
    setAutos(autosAlmacenados);
    reset(); 
  };

  const handleLimpiar = () => {
    reset(); 
    setIndiceEdicion(null); 
  };

  return (
    <div className="container">
      <div className="formulario">
        <h1>Formulario de Autos</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Marca del auto */}
          <label htmlFor="nombre">Marca del auto</label>
          <input 
            type="text" 
            {...register("nombre", {
              required: {
                value: true,
                message: "El Nombre es requerido"
              },
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres"
              },
              maxLength: {
                value: 20,
                message: "El nombre debe tener menos de 20 caracteres"
              }
            })} 
          />
          {errors.nombre && <span>{errors.nombre.message}</span>}
          
          {/* Modelo */}
          <label htmlFor="modelo">Modelo del auto</label>
          <input 
            type="text"
            {...register("modelo", { required: "El modelo es requerido" })}
          />
          {errors.modelo && <span>{errors.modelo.message}</span>}

          {/* Patente */}
          <label htmlFor="patente">Patente</label>
          <input 
            type="text" 
            {...register("patente", {
              required: {
                value: true,
                message: "La patente es requerida"
              },
              validate: validarPatente
            })} 
          />
          {errors.patente && <span>{errors.patente.message}</span>}

          {/* Nacionalidad */}
          <label htmlFor="nacionalidad">Nacionalidad del auto</label>
          <input 
            type="text" 
            {...register("nacionalidad", {
              required: {
                value: true,
                message: "Ingrese la nacionalidad del vehículo"
              }
            })} 
          />
          {errors.nacionalidad && <span>{errors.nacionalidad.message}</span>}

          {/* Tipo de motor */}
          <label htmlFor="tipo">Tipo de motor</label>
          <select 
            {...register("tipo", { required: "El tipo de motor es requerido" })}
          >
              <option value=""></option>
              <option value="mecanico">Mecánico</option>
              <option value="electrico">Eléctrico</option>
              <option value="hibrido">Híbrido</option>
              <option value="gasolina">Gasolina</option>
              <option value="diesel">Diesel</option>
          </select>
          {errors.tipo && <span>{errors.tipo.message}</span>}

          {/* Fecha de creación */}
          <label htmlFor="fecha">Fecha de creación del auto</label>
          <input 
            type="date" 
            {...register("fecha", {
              required: {
                value: true,
                message: "La fecha de creación es requerida"
              },
              validate: validarFecha
            })} 
          />
          {errors.fecha && <span>{errors.fecha.message}</span>}

          {/* Correo electrónico */}
          <label htmlFor="correo">Correo electrónico del dueño</label>
          <input 
            type="email" 
            {...register("correo", {
              required: {
                value: true,
                message: "El correo es requerido"
              },
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Correo no válido"
              }
            })} 
          />
          {errors.correo && <span>{errors.correo.message}</span>}

          <button type="submit">{indexEdit !== null ? 'Actualizar' : 'Enviar'}</button>
          <button type="button" onClick={handleLimpiar}>Limpiar</button>
        </form>
      </div>

      <div className="tabla">
        <h2>Datos de Autos</h2>
        <table>
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Patente</th>
              <th>Nacionalidad</th>
              <th>Tipo de Motor</th>
              <th>Fecha de Creación</th>
              <th>Correo del Dueño</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {autos.map((auto, index) => (
              <tr key={index}>
                <td>{auto.nombre}</td>
                <td>{auto.modelo}</td>
                <td>{auto.patente}</td>
                <td>{auto.nacionalidad}</td>
                <td>{auto.tipo}</td>
                <td>{auto.fecha}</td>
                <td>{auto.correo}</td>
                <td>
                  <button onClick={() => handleEditar(index)}>Editar</button>
                  <button onClick={() => handleEliminar(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
