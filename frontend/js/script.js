const API = 'http://localhost:8000'

// ===========================
// INICIALIZAÇÃO
// ===========================
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('central-grid')) {
        carregarCentral()
    } else if (document.getElementById('tabela-servicos')) {
        // verifica se veio com ?veiculo=id na URL
        const params    = new URLSearchParams(window.location.search)
        const veiculoId = params.get('veiculo')
        carregarServicos(veiculoId)
    } else {
        carregarHome()
    }
})

// ===========================
// HOME
// ===========================
async function carregarHome() {
    const [veiculos, servicos] = await Promise.all([
        fetchAPI('/vehicles/all/'),
        fetchAPI('/services')
    ])

    const todos     = veiculos.message ?? []
    const inativos  = todos.filter(v => !v.active)
    const pendentes = (servicos.message ?? []).filter(s => !s.finish)

    document.getElementById('stat-total').textContent     = todos.length
    document.getElementById('stat-inativos').textContent  = inativos.length
    document.getElementById('stat-pendentes').textContent = pendentes.length

    // em serviço = veículos que têm serviço pendente
    const idsEmServico = [...new Set(pendentes.map(s => s.vehicle_id))]
    document.getElementById('stat-servico').textContent = idsEmServico.length

    // mostra os 8 veículos mais recentes com foto
    const recentes = todos.slice(-8).reverse()
    const grid = document.getElementById('home-grid')
    grid.innerHTML = ''

    await Promise.all(recentes.map(async v => {
        const imgData = await fetchAPI(`/vehicle_images/vehicle/${v.vehicle_id}`)
        const fotos   = imgData.message ?? []
        v._thumb = fotos.length > 0 ? `${API}/${fotos[0].image_path}` : null
    }))

    recentes.forEach(v => {
        const imgContent = v._thumb
            ? `<img src="${v._thumb}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;"><i class="ti ti-car" style="font-size:36px;color:#c4a080;"></i></div>`
            : `<i class="ti ti-car" style="font-size: 36px; color: #c4a080;"></i>`

        const card = document.createElement('div')
        card.style.cssText = `
            background: #fff;
            border: 1px solid var(--marrom-borda);
            border-radius: 10px;
            overflow: hidden;
        `
        card.innerHTML = `
            <div style="height: 100px; background: #f0e0d0; display: flex; align-items: center; justify-content: center; overflow: hidden; ${!v.active ? 'opacity: 0.4;' : ''}">
                ${imgContent}
            </div>
            <div style="padding: 8px 12px 10px;">
                <div style="font-size: 13px; font-weight: 600; color: ${v.active ? 'var(--text-primario)' : 'var(--text-secundario)'};">
                    ${v.model}
                </div>
                <div style="font-size: 11px; color: var(--text-secundario);">
                    ${v.date} · ${v.kind}
                </div>
            </div>
        `
        grid.appendChild(card)
    })
}

// ===========================
// CENTRAL
// ===========================
let todosVeiculos = []
let modoAtivo     = 'none'
let filtroAtivo   = 'todos'
let veiculoSelecionadoId = null

async function carregarCentral() {
    const [dataVeiculos, dataServicos] = await Promise.all([
        fetchAPI('/vehicles/all/'),
        fetchAPI('/services')
    ])
    todosVeiculos = dataVeiculos.message ?? []
    const servicos = dataServicos.message ?? []

    // busca foto e conta serviços pendentes de cada veículo em paralelo
    await Promise.all(todosVeiculos.map(async v => {
        const imgData = await fetchAPI(`/vehicle_images/vehicle/${v.vehicle_id}`)
        const fotos   = imgData.message ?? []
        v._thumb     = fotos.length > 0 ? `${API}/${fotos[0].image_path}` : null
        v._pendentes = servicos.filter(s => s.vehicle_id === v.vehicle_id && !s.finish).length
    }))

    renderizarGrid(todosVeiculos)
}

function renderizarGrid(veiculos) {
    const grid = document.getElementById('central-grid')
    grid.innerHTML = ''

    if (veiculos.length === 0) {
        grid.innerHTML = `<p style="color: var(--text-secundario); font-size: 13px;">Nenhum veículo encontrado.</p>`
        return
    }

    veiculos.forEach(v => {
        const inativo  = !v.active
        const card     = document.createElement('div')
        card.className = 'car-card'
        card.dataset.id = v.vehicle_id

        card.style.cssText = `
            background: #fff;
            border: 2px solid var(--marrom-borda);
            border-radius: 10px;
            overflow: hidden;
            cursor: default;
            transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s, filter 0.15s;
        `

        // monta o conteúdo da imagem — foto real ou ícone placeholder
        const imgContent = v._thumb
            ? `<img src="${v._thumb}"
                    style="width: 100%; height: 100%; object-fit: cover;"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
               <div style="display:none; width:100%; height:100%; align-items:center; justify-content:center;">
                   <i class="ti ti-car" style="font-size: 40px; color: #c4a080;"></i>
               </div>`
            : `<i class="ti ti-car" style="font-size: 40px; color: #c4a080;"></i>`

        card.innerHTML = `
            <div class="card-img" style="height: 120px; background: #f0e0d0; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; ${inativo ? 'opacity: 0.4;' : ''}">
                ${imgContent}
                ${inativo ? `<span style="position: absolute; top: 7px; right: 7px; background: var(--vermelho); color: #fff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 12px;"><i class="ti ti-alert-triangle"></i></span>` : ''}
                ${v._pendentes > 0 ? `<a href="servicos.html?veiculo=${v.vehicle_id}" onclick="event.stopPropagation()" style="position: absolute; bottom: 7px; left: 7px; background: var(--laranja); color: #fff; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 500; text-decoration: none;">${v._pendentes} serviço${v._pendentes > 1 ? 's' : ''}</a>` : ''}
            </div>
            <div style="padding: 8px 10px 10px;">
                <div style="font-size: 13px; font-weight: 600; color: ${inativo ? 'var(--text-secundario)' : 'var(--text-primario)'}; margin-bottom: 1px;">
                    ${v.model} ${v.date}
                </div>
                <div style="font-size: 11px; color: var(--text-secundario); margin-bottom: 8px;">
                    ${v.kind} · ${v.plate}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; border-top: 1px solid #f0e0d0; padding-top: 8px;">
                    <button class="toggle-pill ${v.active ? 'on' : 'off'}" title="${v.active ? 'Desativar' : 'Ativar'}" onclick="event.stopPropagation(); toggleAtivo(${v.vehicle_id}, ${v.active}, this)"></button>
                    <span style="font-size: 11px; color: var(--text-secundario);">${v.active ? 'Ativo' : 'Inativo'}</span>
                </div>
            </div>
        `

        // clique no card abre fotos (modo normal) ou aciona editar/apagar
        card.addEventListener('click', () => handleCardClick(v))

        // clique na imagem abre fotos sempre
        card.querySelector('.card-img').addEventListener('click', (e) => {
            if (modoAtivo === 'none') {
                e.stopPropagation()
                abrirModalFotos(v)
            }
        })

        grid.appendChild(card)
    })

    aplicarEstiloModo()
}

function filtrarCards() {
    const busca = (document.getElementById('busca')?.value ?? '').toLowerCase()
    const kind  = document.getElementById('filtro-kind')?.value ?? ''

    let resultado = todosVeiculos

    if (filtroAtivo === 'ativos')   resultado = resultado.filter(v => v.active)
    if (filtroAtivo === 'inativos') resultado = resultado.filter(v => !v.active)
    if (kind)  resultado = resultado.filter(v => v.kind === kind)
    if (busca) resultado = resultado.filter(v =>
        v.model.toLowerCase().includes(busca) ||
        v.plate.toLowerCase().includes(busca)
    )

    renderizarGrid(resultado)
}

function setFiltroAtivo(valor, btn) {
    filtroAtivo = valor
    document.querySelectorAll('.filters-bar .filter-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    filtrarCards()
}

// ===========================
// MODO SELEÇÃO (editar/apagar)
// ===========================
function setMode(modo) {
    modoAtivo = modo

    const btnEdit = document.getElementById('btn-edit')
    const btnDel  = document.getElementById('btn-del')
    const btnNone = document.getElementById('btn-none')
    const warning = document.getElementById('warning-bar')
    const texto   = document.getElementById('warning-text')

    btnEdit.className = 'btn-mode' + (modo === 'edit' ? ' active-edit' : '')
    btnDel.className  = 'btn-mode' + (modo === 'del'  ? ' active-del'  : '')
    btnNone.className = 'btn-mode'

    if (modo === 'edit') {
        warning.className   = 'warning-bar show'
        texto.textContent   = 'Modo edição ativo — clique no veículo que deseja editar.'
    } else if (modo === 'del') {
        warning.className   = 'warning-bar del show'
        texto.textContent   = 'Modo exclusão ativo — clique no veículo que deseja apagar.'
    } else {
        warning.className   = 'warning-bar'
    }

    aplicarEstiloModo()
}

function aplicarEstiloModo() {
    document.querySelectorAll('.car-card').forEach(card => {
        if (modoAtivo === 'edit') {
            card.style.cursor      = 'pointer'
            card.style.borderColor = 'var(--amarelo-borda)'
            card.style.filter      = 'brightness(0.96)'
            card.onmouseenter = () => {
                card.style.borderColor = 'var(--amarelo-hover)'
                card.style.boxShadow   = '0 0 0 3px rgba(201,143,0,0.2)'
                card.style.transform   = 'scale(1.03)'
                card.style.filter      = 'brightness(1)'
            }
            card.onmouseleave = () => {
                card.style.borderColor = 'var(--amarelo-borda)'
                card.style.boxShadow   = 'none'
                card.style.transform   = 'scale(1)'
                card.style.filter      = 'brightness(0.96)'
            }
        } else if (modoAtivo === 'del') {
            card.style.cursor      = 'pointer'
            card.style.borderColor = '#e08080'
            card.style.filter      = 'brightness(0.96)'
            card.onmouseenter = () => {
                card.style.borderColor = 'var(--vermelho)'
                card.style.boxShadow   = '0 0 0 3px rgba(192,57,43,0.2)'
                card.style.transform   = 'scale(1.03)'
                card.style.filter      = 'brightness(1)'
            }
            card.onmouseleave = () => {
                card.style.borderColor = '#e08080'
                card.style.boxShadow   = 'none'
                card.style.transform   = 'scale(1)'
                card.style.filter      = 'brightness(0.96)'
            }
        } else {
            card.style.cursor      = 'default'
            card.style.borderColor = 'var(--marrom-borda)'
            card.style.boxShadow   = 'none'
            card.style.transform   = 'scale(1)'
            card.style.filter      = 'none'
            card.onmouseenter      = null
            card.onmouseleave      = null
        }
    })
}

function handleCardClick(v) {
    if (modoAtivo === 'edit') {
        abrirModalEditar(v)
    } else if (modoAtivo === 'del') {
        veiculoSelecionadoId = v.vehicle_id
        const icon = document.getElementById('confirm-icon')
        icon.innerHTML = `<i class="ti ti-trash" style="color: var(--vermelho); font-size: 32px;"></i>`
        document.getElementById('confirm-title').textContent = `Apagar ${v.model} ${v.date}?`
        document.getElementById('confirm-sub').textContent   = 'Essa ação não pode ser desfeita.'
        document.getElementById('confirm-ok').style.background = 'var(--vermelho)'
        document.getElementById('confirm-overlay').classList.add('show')
    } else {
        abrirModalFotos(v)
    }
}

async function confirmarAcao() {
    if (!veiculoSelecionadoId) return
    await fetchAPI(`/vehicles/${veiculoSelecionadoId}`, 'DELETE')
    fecharConfirm()
    setMode('none')
    carregarCentral()
}

// ===========================
// TOGGLE ATIVO/INATIVO
// ===========================
async function toggleAtivo(id, ativoAtual, btn) {
    const novoValor = !ativoAtual
    await fetchAPI(`/vehicles/${id}`, 'PATCH', { active: novoValor })

    btn.classList.toggle('on',  novoValor)
    btn.classList.toggle('off', !novoValor)
    btn.title = novoValor ? 'Desativar' : 'Ativar'

    const label = btn.nextElementSibling
    if (label) label.textContent = novoValor ? 'Ativo' : 'Inativo'

    // atualiza o array local
    const v = todosVeiculos.find(v => v.vehicle_id === id)
    if (v) v.active = novoValor

    filtrarCards()
}

// ===========================
// MODAL FOTOS
// ===========================
let veiculoFotosAtual = null

async function abrirModalFotos(v) {
    veiculoFotosAtual = v
    document.getElementById('modal-fotos-titulo').textContent = `${v.model} ${v.date}`
    document.getElementById('modal-fotos').classList.add('show')
    document.getElementById('nova-foto-file').value = ''
    document.getElementById('nome-arquivo').textContent = 'Nenhum arquivo escolhido'

    document.getElementById('nova-foto-file').onchange = function () {
        const nome = this.files[0]?.name ?? 'Nenhum arquivo escolhido'
        document.getElementById('nome-arquivo').textContent = nome
    }

    const data   = await fetchAPI(`/vehicle_images/vehicle/${v.vehicle_id}`)
    const fotos  = data.message ?? []
    const grid   = document.getElementById('fotos-grid')
    grid.innerHTML = ''

    fotos.forEach(f => {
        const thumb = document.createElement('div')
        thumb.style.cssText = `
            aspect-ratio: 1;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--marrom-borda);
            position: relative;
        `
        thumb.innerHTML = `
            <img src="${f.image_path}" style="width: 100%; height: 100%; object-fit: cover;"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div style="display: none; width: 100%; height: 100%; background: #f0e0d0; align-items: center; justify-content: center;">
                <i class="ti ti-photo" style="font-size: 28px; color: #c4a080;"></i>
            </div>
            <button onclick="apagarFoto(${f.image_id}, this)" style="position: absolute; top: 5px; right: 5px; background: var(--vermelho); border: none; border-radius: 50%; width: 22px; height: 22px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                <i class="ti ti-x"></i>
            </button>
        `
        grid.appendChild(thumb)
    })
}

async function adicionarFoto() {
    const input = document.getElementById('nova-foto-file')
    if (!input.files[0] || !veiculoFotosAtual) return

    const form = new FormData()
    form.append('file', input.files[0])

    try {
        const res = await fetch(`${API}/vehicle_images/upload/${veiculoFotosAtual.vehicle_id}`, {
            method: 'POST',
            body: form
            // sem Content-Type! o browser define sozinho pro FormData
        })
        if (!res.ok) {
            console.error('Erro ao fazer upload:', res.status)
            return
        }
    } catch (err) {
        console.error('Erro de conexão:', err)
        return
    }

    input.value = ''
    abrirModalFotos(veiculoFotosAtual)
}

async function apagarFoto(imageId, btn) {
    await fetchAPI(`/vehicle_images/delete/${imageId}`, 'DELETE')
    btn.closest('div[style]').remove()
}

function fecharModalFotos() {
    document.getElementById('modal-fotos').classList.remove('show')
    veiculoFotosAtual = null
}

// ===========================
// MODAL EDITAR VEÍCULO
// ===========================
function abrirModalEditar(v) {
    document.getElementById('edit-id').value    = v.vehicle_id
    document.getElementById('edit-model').value = v.model
    document.getElementById('edit-kind').value  = v.kind
    document.getElementById('edit-date').value  = v.date
    document.getElementById('edit-plate').value = v.plate
    document.getElementById('modal-editar').classList.add('show')
}

async function salvarEdicao() {
    const id = document.getElementById('edit-id').value
    await fetchAPI(`/vehicles/${id}`, 'PUT', {
        model:  document.getElementById('edit-model').value,
        kind:   document.getElementById('edit-kind').value,
        date:   document.getElementById('edit-date').value,
        plate:  document.getElementById('edit-plate').value,
        active: true
    })
    fecharModalEditar()
    setMode('none')
    carregarCentral()
}

function fecharModalEditar() {
    document.getElementById('modal-editar').classList.remove('show')
}

// ===========================
// MODAL NOVO VEÍCULO
// ===========================
function abrirModalVeiculo() {
    document.getElementById('modal-veiculo').classList.add('show')
}

async function salvarVeiculo() {
    await fetchAPI('/vehicles/register', 'POST', {
        model:  document.getElementById('v-model').value,
        kind:   document.getElementById('v-kind').value,
        date:   document.getElementById('v-date').value,
        plate:  document.getElementById('v-plate').value,
        active: true
    })
    fecharModalVeiculo()
    if (document.getElementById('central-grid')) carregarCentral()
    if (document.getElementById('home-grid'))    carregarHome()
}

function fecharModalVeiculo() {
    document.getElementById('modal-veiculo').classList.remove('show')
    document.getElementById('v-model').value = ''
    document.getElementById('v-date').value  = ''
    document.getElementById('v-plate').value = ''
}

// ===========================
// MODAL REGISTRAR SERVIÇO
// ===========================
function abrirModalServico() {
    if (veiculoFotosAtual) {
        document.getElementById('s-vehicle-id').value = veiculoFotosAtual.vehicle_id
    }
    document.getElementById('modal-servico').classList.add('show')
}

async function salvarServico() {
    const vehicleId = document.getElementById('s-vehicle-id').value
    if (!vehicleId) return alert('Selecione um veículo.')

    await fetchAPI('/services/register', 'POST', {
        vehicle_id:  parseInt(vehicleId),
        title:       document.getElementById('s-title').value,
        desc:        document.getElementById('s-desc').value,
        date:        document.getElementById('s-date').value,
        labor_value: parseFloat(document.getElementById('s-labor').value) || 0,
        parts_value: parseFloat(document.getElementById('s-parts-val').value) || 0,
        parts_desc:  document.getElementById('s-parts-desc').value,
        finish:      false
    })
    fecharModalServico()
    if (document.getElementById('tabela-servicos')) carregarServicos()
}

function fecharModalServico() {
    document.getElementById('modal-servico').classList.remove('show')
}

// ===========================
// STATUS
// ===========================
let todosServicos  = []
let todosVeiculosStatus = []
let filtroStatus   = 'todos'
let servicoParaApagar = null

async function carregarServicos(veiculoIdFiltro = null) {
    const [dataServicos, dataVeiculos] = await Promise.all([
        fetchAPI('/services'),
        fetchAPI('/vehicles/all/')
    ])

    todosServicos       = dataServicos.message  ?? []
    todosVeiculosStatus = dataVeiculos.message  ?? []

    // preenche o select de veículos no filtro e no modal
    const selectFiltro = document.getElementById('filtro-veiculo')
    const selectModal  = document.getElementById('s-vehicle-id')

    todosVeiculosStatus.forEach(v => {
        const opt = `<option value="${v.vehicle_id}">${v.model} ${v.date}</option>`
        if (selectFiltro) selectFiltro.innerHTML += opt
        if (selectModal)  selectModal.innerHTML  += opt
    })

    // aplica filtro de veículo se veio pela URL ou badge
    if (veiculoIdFiltro && selectFiltro) {
        selectFiltro.value = veiculoIdFiltro
        filtroStatus = 'pendente'
        document.querySelectorAll('.filters-bar .filter-btn').forEach(b => {
            b.classList.toggle('active', b.textContent.trim() === 'Pendentes')
        })
    }

    filtrarTabela()
}

function renderizarTabela(servicos) {
    const container = document.getElementById('tabela-servicos')
    container.innerHTML = ''

    const isCards = container.tagName !== 'TBODY' && !container.closest('table')

    if (servicos.length === 0) {
        container.innerHTML = isCards
            ? `<p style="color: var(--text-secundario); font-size: 13px;">Nenhum serviço encontrado.</p>`
            : `<tr><td colspan="7" style="text-align: center; color: var(--text-secundario); padding: 24px;">Nenhum serviço encontrado.</td></tr>`
        return
    }

    servicos.forEach(s => {
        const veiculo     = todosVeiculosStatus.find(v => v.vehicle_id === s.vehicle_id)
        const nomeVeiculo = veiculo ? `${veiculo.model} ${veiculo.date}` : '—'

        if (isCards) {
            const card = document.createElement('div')
            card.style.cssText = `
                background: #fff;
                border: 1px solid var(--marrom-borda);
                border-radius: 10px;
                padding: 14px 16px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            `
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 14px; font-weight: 600; color: var(--text-primario); margin-bottom: 2px;">${s.title}</div>
                        <div style="font-size: 11px; color: var(--text-secundario);"><i class="ti ti-car" style="font-size:12px;"></i> ${nomeVeiculo}</div>
                    </div>
                    <span class="badge ${s.finish ? 'badge-done' : 'badge-pend'}">${s.finish ? 'Concluído' : 'Pendente'}</span>
                </div>
                <div style="font-size: 12px; color: var(--text-secundario); line-height: 1.5;">${s.desc}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0e0d0; padding-top: 8px;">
                    <div style="font-size: 11px; color: var(--text-secundario);"><i class="ti ti-calendar" style="font-size:12px;"></i> ${s.date}</div>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-icon btn-edit" onclick="abrirModalEditarServico(${s.service_id})" title="Editar"><i class="ti ti-pencil"></i></button>
                        <button class="btn-icon btn-del" onclick="confirmarApagarServico(${s.service_id})" title="Apagar"><i class="ti ti-trash"></i></button>
                    </div>
                </div>
            `
            container.appendChild(card)
        } else {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${nomeVeiculo}</td>
                <td>${s.title}</td>
                <td>${s.date}</td>
                <td>R$ ${(s.labor_value ?? 0).toFixed(2)}</td>
                <td>R$ ${(s.parts_value ?? 0).toFixed(2)}</td>
                <td><span class="badge ${s.finish ? 'badge-done' : 'badge-pend'}">${s.finish ? 'Concluído' : 'Pendente'}</span></td>
                <td>
                    <div class="td-actions">
                        <button class="btn-icon btn-edit" onclick="abrirModalEditarServico(${s.service_id})" title="Editar"><i class="ti ti-pencil"></i></button>
                        <button class="btn-icon btn-del" onclick="confirmarApagarServico(${s.service_id})" title="Apagar"><i class="ti ti-trash"></i></button>
                    </div>
                </td>
            `
            container.appendChild(tr)
        }
    })
}

function filtrarTabela() {
    const veiculoId = document.getElementById('filtro-veiculo')?.value

    let resultado = todosServicos

    if (filtroStatus === 'pendente')  resultado = resultado.filter(s => !s.finish)
    if (filtroStatus === 'concluido') resultado = resultado.filter(s =>  s.finish)
    if (veiculoId) resultado = resultado.filter(s => s.vehicle_id === parseInt(veiculoId))

    renderizarTabela(resultado)
}

function setFiltroStatus(valor, btn) {
    filtroStatus = valor
    document.querySelectorAll('.filters-bar .filter-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    filtrarTabela()
}

// ===========================
// MODAL EDITAR SERVIÇO
// ===========================
function abrirModalEditarServico(id) {
    const s = todosServicos.find(s => s.service_id === id)
    if (!s) return

    document.getElementById('es-id').value        = s.service_id
    document.getElementById('es-title').value      = s.title
    document.getElementById('es-desc').value       = s.desc
    document.getElementById('es-date').value       = s.date
    document.getElementById('es-labor').value      = s.labor_value ?? ''
    document.getElementById('es-parts-val').value  = s.parts_value ?? ''
    document.getElementById('es-parts-desc').value = s.parts_desc  ?? ''
    document.getElementById('es-finish').value     = s.finish ? 'true' : 'false'

    document.getElementById('modal-editar-servico').classList.add('show')
}

async function salvarEdicaoServico() {
    const id = document.getElementById('es-id').value
    const s  = todosServicos.find(s => s.service_id === parseInt(id))

    await fetchAPI(`/services/update/${id}`, 'PUT', {
        vehicle_id:  s.vehicle_id,
        title:       document.getElementById('es-title').value,
        desc:        document.getElementById('es-desc').value,
        date:        document.getElementById('es-date').value,
        labor_value: parseFloat(document.getElementById('es-labor').value) || 0,
        parts_value: parseFloat(document.getElementById('es-parts-val').value) || 0,
        parts_desc:  document.getElementById('es-parts-desc').value,
        finish:      document.getElementById('es-finish').value === 'true'
    })
    fecharModalEditarServico()
    carregarServicos()
}

function fecharModalEditarServico() {
    document.getElementById('modal-editar-servico').classList.remove('show')
}

// ===========================
// APAGAR SERVIÇO
// ===========================
function confirmarApagarServico(id) {
    servicoParaApagar = id
    document.getElementById('confirm-overlay').classList.add('show')
}

async function confirmarApagar() {
    if (!servicoParaApagar) return
    await fetchAPI(`/services/delete/${servicoParaApagar}`, 'DELETE')
    fecharConfirm()
    carregarServicos()
}

function fecharConfirm() {
    document.getElementById('confirm-overlay').classList.remove('show')
    veiculoSelecionadoId  = null
    servicoParaApagar     = null
}

// ===========================
// FETCH HELPER
// ===========================
async function fetchAPI(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    }
    if (body) options.body = JSON.stringify(body)

    try {
        const res  = await fetch(API + endpoint, options)
        if (!res.ok) {
            console.error(`Erro ${res.status} em ${endpoint}`)
            return {}
        }
        return await res.json()
    } catch (err) {
        console.error('Erro de conexão:', err)
        return {}
    }
}