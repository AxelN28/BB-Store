import { Component } from 'react';

export default class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="scene-status" role="status">
          La exhibicion 3D no pudo cargar. <a href="#coleccion">Abrir el catalogo</a>
        </p>
      );
    }
    return this.props.children;
  }
}
