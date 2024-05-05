class UserModel {
  puntuacion: number;
  nombre: string;
  bio: string;
  email: string;
  facebook: string;
  twitter: string;
  movil: number;
  instagram: string;
  avatar: string;
  id: number;

  constructor(
    puntuacion: number,
    nombre: string,
    bio: string,
    email: string,
    facebook: string,
    twitter: string,
    movil: number,
    instagram: string,
    avatar: string,
    id: number
  ) {
    this.nombre = nombre;
    this.puntuacion = puntuacion;
    this.bio = bio;
    this.email = email;
    this.facebook = facebook;
    this.twitter = twitter;
    this.movil = movil;
    this.instagram = instagram;
    this.avatar = avatar;
    this.id = id;
  }
}

export default UserModel;
