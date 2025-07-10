import { FaGithub, FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-4 mt-5">
      <div className="container">
        <p className="mb-2">
          Feito por uma equipe RPGística
        </p>
        <a
          href="https://github.com/Denis-H-F-Faria/A-Lista-de-Freyr"
          className="text-light"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={20} /> GitHub
        </a>
        <p className="mt-2 mb-0">
          &copy; {new Date().getFullYear()} A Lista de Freyr
        </p>
      </div>
    </footer>
  );
}