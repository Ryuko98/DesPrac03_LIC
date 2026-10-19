"use client";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconPokeball, IconSearch, IconTable, IconLayoutGrid, IconFilter } from '@tabler/icons-react';

export default function Home() {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    numero: '',
    nombre: '',
    tipo: 'Normal',
    nivel: '',
    imagenTipo: 'url', // 'url' o 'archivo'
    imagenUrl: '',
    imagenFile: null
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para la lista de Pokémon registrados
  const [pokemonList, setPokemonList] = useState([]);
  
  // Estados para los filtros de búsqueda avanzados
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // Estado para el tipo de vista ('tabla' o 'tarjetas')
  const [vista, setVista] = useState('tabla'); 
  const [mensajeExito, setMensajeExito] = useState(false);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagenFile' && files && files[0]) {
      setFormData((prev) => ({ ...prev, imagenFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
    }
  };

  // Validación de campos obligatorios
  const validar = () => {
    let nuevosErrores = {};
    if (!formData.numero) nuevosErrores.numero = 'El número de Pokédex es obligatorio.';
    if (!formData.nombre) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!formData.tipo) nuevosErrores.tipo = 'El tipo es obligatorio.';
    if (!formData.nivel) nuevosErrores.nivel = 'El nivel es obligatorio.';
    
    if (formData.imagenTipo === 'url' && !formData.imagenUrl.trim()) {
      nuevosErrores.imagen = 'Debe ingresar una URL de imagen válida.';
    }
    if (formData.imagenTipo === 'archivo' && !formData.imagenFile) {
      nuevosErrores.imagen = 'Debe seleccionar un archivo de imagen.';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    // Procesar la fuente de la imagen
    let imagenSrc = '';
    if (formData.imagenTipo === 'url') {
      imagenSrc = formData.imagenUrl;
    } else if (formData.imagenFile) {
      imagenSrc = URL.createObjectURL(formData.imagenFile);
    }

    const nuevoPokemon = {
      id: Date.now(),
      numero: formData.numero,
      nombre: formData.nombre,
      tipo: formData.tipo,
      nivel: formData.nivel,
      imagen: imagenSrc
    };

    setPokemonList([...pokemonList, nuevoPokemon]);
    
    // Limpiar formulario asegurando valores no undefined
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
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };

  // Filtrar Pokémon por nombre/número y también por el tipo seleccionado
  const pokemonFiltrados = pokemonList.filter(p => {
    const coincideTexto = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          p.numero.toString().includes(busqueda);
    const coincideTipo = filtroTipo === 'Todos' || p.tipo === filtroTipo;
    return coincideTexto && coincideTipo;
  });

  return (
    <main style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="container py-5">
        
        {/* Encabezado con el ícono de Pokéball */}
        <div className="mb-4 d-flex align-items-center gap-3">
          <div className="p-3 bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-primary shadow-sm">
            <IconPokeball size={36} stroke={1.8} />
          </div>
          <div>
            <h2 className="fw-bold text-dark mb-0">Mi Pokédex React</h2>
            <p className="text-muted mb-0">Registra, administra y visualiza tus Pokémon de forma sencilla.</p>
          </div>
        </div>

        {/* Alerta de éxito */}
        {mensajeExito && (
          <div className="alert alert-success shadow-sm border-0 mb-4" role="alert">
            ¡Pokémon registrado exitosamente en la Pokédex!
          </div>
        )}

        {/* Formulario Estático Arriba (Estilo Tarjeta Blanca) */}
        <div className="card shadow-sm border-0 bg-white p-4 mb-5 rounded-4">
          <h4 className="fw-semibold mb-3 text-secondary">Registrar Nuevo Pokémon</h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              
              {/* Número de Pokédex */}
              <div className="col-md-3">
                <label className="form-label fw-medium">N° Pokédex</label>
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

              {/* Nombre */}
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

              {/* Tipo Principal */}
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

              {/* Nivel */}
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

              {/* Selección de Imagen (URL vs Archivo) */}
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

            {/* Botón Enviar */}
            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-danger px-4 py-2 fw-medium shadow-sm">
                Agregar Pokémon
              </button>
            </div>
          </form>
        </div>

        {/* Barra de Controles Avanzada: Buscador por texto/número + Filtro por Tipo */}
        <div className="row align-items-center mb-4 g-3">
          {/* Input de Buscador */}
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

          {/* Selector de Filtro por Tipo */}
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

          {/* Contador y Botones de Vista */}
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

        {/* Sección de Visualización (Tabla o Tarjetas sobre fondo blanco) */}
        {pokemonFiltrados.length === 0 ? (
          <div className="card shadow-sm border-0 bg-white p-5 text-center rounded-4">
            <p className="text-muted mb-0">No se encontraron Pokémon registrados o coincidentes con los filtros.</p>
          </div>
        ) : vista === 'tabla' ? (
          /* VISTA DE TABLA */
          <div className="card shadow-sm border-0 bg-white rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3 ps-4">Imagen</th>
                    <th className="py-3">N°</th>
                    <th className="py-3">Nombre</th>
                    <th className="py-3">Tipo</th>
                    <th className="py-3 pe-4">Nivel</th>
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
                      <td className="pe-4 fw-medium">Nv. {p.nivel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* VISTA DE TARJETAS (GRID) */
          <div className="row g-4">
            {pokemonFiltrados.map((p) => (
              <div className="col-md-4 col-sm-6" key={p.id}>
                <div className="card shadow-sm border-0 bg-white rounded-4 h-100 text-center p-3">
                  <div className="mx-auto mt-2 p-2 bg-light rounded-circle border" style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={p.imagen} 
                      alt={p.nombre} 
                      style={{ maxHeight: '75px', maxWidth: '75px', objectFit: 'contain' }} 
                    />
                  </div>
                  <div className="card-body">
                    <span className="text-muted small fw-semibold">#{p.numero}</span>
                    <h5 className="card-title fw-bold text-dark mt-1">{p.nombre}</h5>
                    <div className="mb-3">
                      <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1">
                        {p.tipo}
                      </span>
                    </div>
                    <p className="text-secondary mb-0 fw-medium">Nivel: {p.nivel}</p>
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