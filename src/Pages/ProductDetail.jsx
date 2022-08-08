import propTypes from 'prop-types';
import React from 'react';
import ShoppingCartButton from '../components/ShoppingCartButton';
import ProductEvaluation from '../components/ProductEvaluation';

class ProductDetail extends React.Component {
  state = {
    requestedProduct: [],
    email: '',
    evaluation: '',
    rate: 1,
    isSubmitButtonDisabled: true,
    // evaluations: [],
  }

  async componentDidMount() {
    const { match: { params: { id } } } = this.props;
    const url = `https://api.mercadolibre.com/items/${id}`;
    const response = await fetch(url);
    const requestedProduct = await response.json();
    this.setState({
      requestedProduct,
    });
  }

  // habilitar botão 'Avaliar'

  isSubmitButtonDisabled = () => {
    const {
      email,
      rate } = this.state;
    const fielddEmail = email.length === 0;
    // capturar o innex text do select e passar como state
    const fieldRate = Number(rate) === 0;
    const verify = fieldRate && fielddEmail;

    this.setState({
      isSubmitButtonDisabled: verify,
    });
  }

  onClickChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    }, () => {
      this.isSaveButtonDisabled();
    });
  }

  // Salva avalação e limpa inputs

  onSubmitButtonClick = (event) => {
    event.preventDefault();
    const {
      email,
      rate,
      evaluation } = this.state;

    const objEvaluation = {
      email,
      rate,
      evaluation,
    };
    this.setState((prevState) => ({
      evaluations: [...prevState.evaluations, objEvaluation],
    }));

    this.setState({
      email: '',
      evaluation: '',
      rate: 1,
      isSubmitButtonDisabled: true,
    });
  }

  render() {
    const { requestedProduct: { title, price, thumbnail },
      email,
      rate,
      evaluation,
      isSubmitButtonDisabled,
      onClickChange } = this.state;
    return (
      <div>
        <ShoppingCartButton />
        <div>
          <p data-testid="product-detail-name">{ title }</p>
          <p data-testid="product-detail-price">
            {' '}
            { `R$ ${price}` }
          </p>
          <div>
            <img
              data-testid="product-detail-image"
              src={ thumbnail }
              alt={ title }
            />
          </div>
        </div>
        <ProductEvaluation
          email={ email }
          rate={ rate }
          evaluation={ evaluation }
          isSubmitButtonDisabled={ isSubmitButtonDisabled }
          onClickChange={ onClickChange }
        />
      </div>
    );
  }
}

ProductDetail.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProductDetail;
