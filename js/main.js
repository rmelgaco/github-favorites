import { FavoritesView } from "./favorites.js";


//nesse momento, o #app entrou como parâmetro para o root, o qual jogou para o super e, por sua vez, se conectou com o constructor do class Favorites, que fez com que o #app fosse pesquisado pelo querySelector e armazenado no this.root.
new FavoritesView("#app")