//Classe para acessar a API do GitHub com estática e promessas 
export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(({login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}


//classe que vai conter a lógica dos dados
//como os dados serão estruturados
export class Favorites {
    //o constructor recebe uma entrada root, que é o #app do html
    constructor(root){
        this.root = document.querySelector(root)
        this.load()

        GithubUser.search('rmelgaco')
        .then(user => console.log(user))
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    async add(username){
        try{
            const userExists = this.entries.find(entry => entry.login === username)

            if (userExists) {
                throw new Error ('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } 
        catch (error){
            alert(error.message)
        }
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    delete(user) {
        this.entries = this.entries
        .filter(entry => entry.login !== user.login)
        this.update()
        this.save()
    }
}



//classe que vai criar a visualização do html (que é que vai tratar com os eventos ejogar pra tela)
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector("table tbody")

        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('.favorite-btn')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.input-wrapper input')

            this.add(value)
        }
    }

//essa função update serve para toda vez que um dado for alterado, ela será executada. Toda vez que adicionar, remover ou modificar, ela irá rodar.
    update (){
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove-btn').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar este usuário?')
                if (isOk) {
                    this.delete(user)
                }
            }


            this.tbody.append(row)
        })
     }

//função que irá criar as trs (que será usada quando clicar em favoritar)     
    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="Imagem do Usuário">
                <a href="https://github.com/maykbrito" target="_blank">
                    <p>Mayk Brito</p>
                    <span>/maykbrito</span>
                </a>
            </td>
            <td class="repositories">121</td>
            <td class="followers">15317</td>
            <td class="remove-btn">
                <button>&times;</button>
            </td>
        `
        return tr
    }

//função que irá remover todas as trs da table, resetando ela toda vez que for dado o update (será chamada na função update)
    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
                tr.remove()
            })
    }
}