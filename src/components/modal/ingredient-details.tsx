import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
  onAdd: (ingredientId: string) => void;
};

export const IngredientDetails = ({
  ingredient,
  onAdd,
}: TIngredientDetailsProps): React.JSX.Element => (
  <div className={styles.details_container}>
    <div className={styles.details_image_wrap}>
      <img
        src={ingredient.image_large}
        alt={ingredient.name}
        className={styles.details_image}
      />
    </div>
    <h3 className={`text text_type_main-medium ${styles.details_name}`}>
      {ingredient.name}
    </h3>
    <div className={styles.details_price}>
      <p className="text text_type_digits-default">{ingredient.price}</p>
      <CurrencyIcon type="primary" />
    </div>
    <ul className={styles.nutrition_list}>
      <li className={styles.nutrition_item}>
        <p className="text text_type_main-default text_color_inactive">Калории, ккал</p>
        <p className="text text_type_digits-default text_color_primary">
          {ingredient.calories}
        </p>
      </li>
      <li className={styles.nutrition_item}>
        <p className="text text_type_main-default text_color_inactive">Белки, г</p>
        <p className="text text_type_digits-default text_color_primary">
          {ingredient.proteins}
        </p>
      </li>
      <li className={styles.nutrition_item}>
        <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
        <p className="text text_type_digits-default text_color_primary">
          {ingredient.fat}
        </p>
      </li>
      <li className={styles.nutrition_item}>
        <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
        <p className="text text_type_digits-default text_color_primary">
          {ingredient.carbohydrates}
        </p>
      </li>
    </ul>
    <button
      type="button"
      className={`button button_type_primary button_size_large ${styles.add_button}`}
      onClick={() => onAdd(ingredient._id)}
    >
      Добавить в конструктор
    </button>
  </div>
);

export default IngredientDetails;
