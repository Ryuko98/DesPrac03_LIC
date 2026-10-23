"use client";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconPokeball, IconSearch, IconTable, IconLayoutGrid, IconFilter, IconEdit, IconTrash } from '@tabler/icons-react';

export default function Home() {
  // estado para los campos del formulario
  const [formData, setFormData] = useState({
    numero: '',
    nombre: '',
    tipo: 'Normal',
    nivel: '',
    imagenTipo: 'url', // 'url' o 'archivo'
    imagenUrl: '',
    imagenFile: null
  });

  // estado para errores de validación
  const [errors, setErrors] = useState({});

  // estado para la lista de Pokémon registrados
  const [pokemonList, setPokemonList] = useState([]);

  // estado para controlar si estamos editando un Pokémon (guarda su id o null)
  const [editandoId, setEditandoId] = useState(null);

  // estados para los filtros de búsqueda avanzados
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // estado para el tipo de vista ('tabla' o 'tarjetas')
  const [vista, setVista] = useState('tabla'); 
  const [mensajeExito, setMensajeExito] = useState('');

  // manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagenFile' && files && files[0]) {
      setFormData((prev) => ({ ...prev, imagenFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
    }
  };

  // validaciones (campos obligatorios y que sea de la primera gen)
  const validar = () => {
    let nuevosErrores = {};

    // validación de que el numero de pokedex este entre el rango de la primera gen
    const numPokedex = parseInt(formData.numero);
    if (!formData.numero) {
      nuevosErrores.numero = 'El número de Pokédex es obligatorio.';
    } else if (isNaN(numPokedex) || numPokedex < 1 || numPokedex > 151) {
      nuevosErrores.numero = 'Este pokémon no pertenece a la primera generación (los primeros 151 pokémon).';
    }

    // validacion de campos vacios
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!formData.tipo) nuevosErrores.tipo = 'El tipo es obligatorio.';
    if (!formData.nivel) nuevosErrores.nivel = 'El nivel es obligatorio.';

    if (formData.imagenTipo === 'url' && !formData.imagenUrl.trim()) {
      nuevosErrores.imagen = 'Debe ingresar una URL de imagen válida.';
    }
    // si estamos editando y ya tenía imagen previa, el archivo no es estrictamente obligatorio de resubirla
    if (formData.imagenTipo === 'archivo' && !formData.imagenFile && !editandoId) {
      nuevosErrores.imagen = 'Debe seleccionar un archivo de imagen.';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // manejador del envio del formulario (Crear o Actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    // procesar la fuente de la imagen
    let imagenSrc = formData.imagenUrl;
    if (formData.imagenTipo === 'archivo' && formData.imagenFile) {
      imagenSrc = URL.createObjectURL(formData.imagenFile);
    } else if (editandoId && formData.imagenTipo === 'url' && !formData.imagenUrl) {
      // Si edita y no cambia la URL, conservamos la anterior (manejado abajo)
      const pokemonActual = pokemonList.find(p => p.id === editandoId);
      imagenSrc = pokemonActual ? pokemonActual.imagen : '';
    }

    if (editandoId !== null) {
      // formulario modo actualizar
      setPokemonList(pokemonList.map(p => {
        if (p.id === editandoId) {
          return {
            ...p,
            numero: formData.numero,
            nombre: formData.nombre,
            tipo: formData.tipo,
            nivel: formData.nivel,
            imagen: imagenSrc || p.imagen
          };
        }
        return p;
      }));
      setMensajeExito('¡Pokémon actualizado exitosamente!');
      setEditandoId(null);
    } else {
      // formulario modo crear
      const nuevoPokemon = {
        id: Date.now(),
        numero: formData.numero,
        nombre: formData.nombre,
        tipo: formData.tipo,
        nivel: formData.nivel,
        imagen: imagenSrc
      };
      setPokemonList([...pokemonList, nuevoPokemon]);
      setMensajeExito('¡Pokémon registrado exitosamente en la Pokédex!');
    }

    // limpiar formulario asegurando valores no indefinidos
    setFormData({
      numero: '',
      nombre: '',
      tipo: 'Normal',
      nivel: '',
      imagenTipo: 'url',
      imagenUrl: '',
      imagenFile: null
    });
    setErrors({});
    setTimeout(() => setMensajeExito(''), 3000);
  };

  // función para cargar los datos del pokémon al formulario para editarlos
  const handleEditar = (pokemon) => {
    setEditandoId(pokemon.id);
    setFormData({
      numero: pokemon.numero,
      nombre: pokemon.nombre,
      tipo: pokemon.tipo,
      nivel: pokemon.nivel,
      imagenTipo: 'url',
      imagenUrl: pokemon.imagen.startsWith('blob:') ? '' : pokemon.imagen, // Si es blob local, pedirá nueva URL o archivo si se cambia
      imagenFile: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube suavemente al formulario
  };

  // función para eliminar un pokémon del arreglo
  const handleEliminar = (id) => {
    if (confirm('¿Estás seguro de eliminar este Pokémon de la Pokédex?')) {
      setPokemonList(pokemonList.filter(p => p.id !== id));
      if (editandoId === id) {
        // Si borramos el que estábamos editando, limpiamos el form
        setEditandoId(null);
        setFormData({ numero: '', nombre: '', tipo: 'Normal', nivel: '', imagenTipo: 'url', imagenUrl: '', imagenFile: null });
      }
    }
  };

  // filtrar pokémon por nombre o número y también por el tipo seleccionado
  const pokemonFiltrados = pokemonList.filter(p => {
    const coincideTexto = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          p.numero.toString().includes(busqueda);
    const coincideTipo = filtroTipo === 'Todos' || p.tipo === filtroTipo;
    return coincideTexto && coincideTipo;
  });

  return (
    <main style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="container py-5">

        {/* encabezado */}
        <div className="mb-4 d-flex align-items-center gap-3">
          <div className="p-3 bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-primary shadow-sm">
            <IconPokeball size={36} stroke={1.8} />
          </div>
          <div>
            <h2 className="fw-bold text-dark mb-0">Mi Pokédex React</h2>
            <p className="text-muted mb-0">Registra, administra y visualiza tus Pokémon de forma sencilla.</p>
          </div>
        </div>

        {/* alerta de éxito */}
        {mensajeExito && (
          <div className="alert alert-success shadow-sm border-0 mb-4" role="alert">
            {mensajeExito}
          </div>
        )}

        {/* form para ingresar o actualizar los datos */}
        <div className="card shadow-sm border-0 bg-white p-4 mb-5 rounded-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-semibold text-secondary mb-0">
              {editandoId ? `Editando Pokémon (ID: ${editandoId})` : 'Registrar Nuevo Pokémon (1ª Gen)'}
            </h4>
            {editandoId && (
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setEditandoId(null);
                  setFormData({ numero: '', nombre: '', tipo: 'Normal', nivel: '', imagenTipo: 'url', imagenUrl: '', imagenFile: null });
                }}
              >
                Cancelar Edición
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* numero pokedex */}
              <div className="col-md-3">
                <label className="form-label fw-medium">N° Pokédex (1 - 151)</label>
                <input
                  type="number"
                  className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  placeholder="Ej. 025"
                />
                {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
              </div>

              {/* nombre */}
              <div className="col-md-3">
                <label className="form-label fw-medium">Nombre</label>
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Pikachu"
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              {/* tipo principal */}
              <div className="col-md-3">
                <label className="form-label fw-medium">Tipo Principal</label>
                <select
                  className="form-select"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value="Normal">Normal</option>
                  <option value="Fuego">Fuego</option>
                  <option value="Agua">Agua</option>
                  <option value="Planta">Planta</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="Hielo">Hielo</option>
                  <option value="Lucha">Lucha</option>
                  <option value="Veneno">Veneno</option>
                  <option value="Tierra">Tierra</option>
                  <option value="Volador">Volador</option>
                  <option value="Psíquico">Psíquico</option>
                  <option value="Bicho">Bicho</option>
                  <option value="Roca">Roca</option>
                  <option value="Fantasma">Fantasma</option>
                  <option value="Dragón">Dragón</option>
                  <option value="Siniestro">Siniestro</option>
                  <option value="Acero">Acero</option>
                  <option value="Hada">Hada</option>
                </select>
              </div>

              {/* nivel */}
              <div className="col-md-3">
                <label className="form-label fw-medium">Nivel</label>
                <input
                  type="number"
                  className={`form-control ${errors.nivel ? 'is-invalid' : ''}`}
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  placeholder="Ej. 50"
                />
                {errors.nivel && <div className="invalid-feedback">{errors.nivel}</div>}
              </div>

              {/* selección de imagen (URL || archivo) */}
              <div className="col-md-12 mt-3">
                <label className="form-label fw-medium">Imagen del Pokémon</label>
                <div className="d-flex gap-3 mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="imagenTipo"
                      id="tipoUrl"
                      value="url"
                      checked={formData.imagenTipo === 'url'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="tipoUrl">Usar URL</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="imagenTipo"
                      id="tipoArchivo"
                      value="archivo"
                      checked={formData.imagenTipo === 'archivo'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="tipoArchivo">Subir archivo del equipo</label>
                  </div>
                </div>

                {formData.imagenTipo === 'url' ? (
                  <input
                    key="input-url"
                    type="text"
                    className={`form-control ${errors.imagen ? 'is-invalid' : ''}`}
                    name="imagenUrl"
                    value={formData.imagenUrl || ''}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/pokemon.png"
                  />
                ) : (
                  <input
                    key="input-archivo"
                    type="file"
                    accept="image/*"
                    className={`form-control ${errors.imagen ? 'is-invalid' : ''}`}
                    name="imagenFile"
                    onChange={handleChange}
                  />
                )}
                {errors.imagen && <div className="invalid-feedback d-block">{errors.imagen}</div>}
              </div>

            </div>

            {/* btn enviar / actualizar */}
            <div className="mt-4 text-end">
              <button type="submit" className={`btn ${editandoId ? 'btn-success' : 'btn-danger'} px-4 py-2 fw-medium shadow-sm`}>
                {editandoId ? 'Actualizar Pokémon' : 'Agregar Pokémon'}
              </button>
            </div>
          </form>
        </div>

        {/* controles: buscador por texto o número, filtro por tipo */}
        <div className="row align-items-center mb-4 g-3">
          {/* input buscador */}
          <div className="col-md-5">
            <div className="input-group bg-white shadow-sm rounded-3 overflow-hidden border">
              <span className="input-group-text bg-white border-0 text-muted ps-3">
                <IconSearch size={20} />
              </span>
              <input
                type="text"
                className="form-control bg-white border-0 py-2 ps-1 shadow-none"
                placeholder="Buscar por nombre o número..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          {/* selector de filtro por tipo */}
          <div className="col-md-3">
            <div className="input-group bg-white shadow-sm rounded-3 overflow-hidden border">
              <span className="input-group-text bg-white border-0 text-muted ps-3">
                <IconFilter size={18} />
              </span>
              <select
                className="form-select bg-white border-0 py-2 shadow-none"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="Todos">Filtrar por tipo (Todos)</option>
                <option value="Normal">Normal</option>
                <option value="Fuego">Fuego</option>
                <option value="Agua">Agua</option>
                <option value="Planta">Planta</option>
                <option value="Eléctrico">Eléctrico</option>
                <option value="Hielo">Hielo</option>
                <option value="Lucha">Lucha</option>
                <option value="Veneno">Veneno</option>
                <option value="Tierra">Tierra</option>
                <option value="Volador">Volador</option>
                <option value="Psíquico">Psíquico</option>
                <option value="Bicho">Bicho</option>
                <option value="Roca">Roca</option>
                <option value="Fantasma">Fantasma</option>
                <option value="Dragón">Dragón</option>
                <option value="Siniestro">Siniestro</option>
                <option value="Acero">Acero</option>
                <option value="Hada">Hada</option>
              </select>
            </div>
          </div>

          {/* contador y botones para cambiar la vista */}
          <div className="col-md-4 d-flex justify-content-md-end align-items-center gap-2">
            <span className="badge bg-secondary fs-6 px-3 py-2">
              Total: {pokemonList.length}
            </span>
            <div className="btn-group shadow-sm" role="group">
              <button
                type="button"
                className={`btn btn-sm d-flex align-items-center gap-1 px-2 ${vista === 'tabla' ? 'btn-primary' : 'btn-light bg-white text-dark'}`}
                onClick={() => setVista('tabla')}
              >
                <IconTable size={16} /> Tabla
              </button>
              <button
                type="button"
                className={`btn btn-sm d-flex align-items-center gap-1 px-2 ${vista === 'tarjetas' ? 'btn-primary' : 'btn-light bg-white text-dark'}`}
                onClick={() => setVista('tarjetas')}
              >
                <IconLayoutGrid size={16} /> Tarjetas
              </button>
            </div>
          </div>
        </div>

        {/* visualización de registros */}
        {pokemonFiltrados.length === 0 ? (
          <div className="card shadow-sm border-0 bg-white p-5 text-center rounded-4">
            <p className="text-muted mb-0">No se encontraron Pokémon registrados o coincidentes con los filtros.</p>
          </div>
        ) : vista === 'tabla' ? (
          /* vista opción tabla */
          <div className="card shadow-sm border-0 bg-white rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3 ps-4">Imagen</th>
                    <th className="py-3">N°</th>
                    <th className="py-3">Nombre</th>
                    <th className="py-3">Tipo</th>
                    <th className="py-3">Nivel</th>
                    <th className="py-3 text-center pe-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pokemonFiltrados.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-4">
                        <img 
                          src={p.imagen} 
                          alt={p.nombre} 
                          style={{ width: '45px', height: '45px', objectFit: 'contain' }} 
                          className="bg-light rounded p-1 border"
                        />
                      </td>
                      <td className="fw-semibold text-secondary">#{p.numero}</td>
                      <td className="fw-bold text-dark">{p.nombre}</td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1">
                          {p.tipo}
                        </span>
                      </td>
                      <td className="fw-medium">Nv. {p.nivel}</td>
                      <td className="text-center pe-4">
                        <div className="d-flex justify-content-center gap-2">
                          <button 
                            className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                            onClick={() => handleEditar(p)}
                            title="Editar Pokémon"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <IconEdit size={16} />
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                            onClick={() => handleEliminar(p.id)}
                            title="Eliminar Pokémon"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* vista opción tarjetas */
          <div className="row g-4">
            {pokemonFiltrados.map((p) => (
              <div className="col-md-4 col-sm-6" key={p.id}>
                <div className="card shadow-sm border-0 bg-white rounded-4 h-100 text-center p-3 d-flex flex-column justify-content-between">
                  <div>
                    <div className="mx-auto mt-2 p-2 bg-light rounded-circle border" style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={p.imagen} 
                        alt={p.nombre} 
                        style={{ maxHeight: '75px', maxWidth: '75px', objectFit: 'contain' }} 
                      />
                    </div>
                    <div className="card-body pb-2">
                      <span className="text-muted small fw-semibold">#{p.numero}</span>
                      <h5 className="card-title fw-bold text-dark mt-1">{p.nombre}</h5>
                      <div className="mb-2">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1">
                          {p.tipo}
                        </span>
                      </div>
                      <p className="text-secondary mb-0 fw-medium">Nivel: {p.nivel}</p>
                    </div>
                  </div>
                  {/* botones de acción en tarjeta */}
                  <div className="card-footer bg-white border-0 pt-0 pb-2">
                    <div className="d-flex justify-content-center gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 px-3"
                        onClick={() => handleEditar(p)}
                      >
                        <IconEdit size={16} /> Editar
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3"
                        onClick={() => handleEliminar(p.id)}
                      >
                        <IconTrash size={16} /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}