import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@/utils/types';

import styles from './ingredient-item.module.css';

type TIngredientCardProps = {
  item: TIngredient & { count?: number };
  count?: number;
  onSelect: (ingredientId: string) => void;
};

function IngredientCard({
  item,
  count = 0,
  onSelect,
}: TIngredientCardProps): React.JSX.Element {
  return (
    <li key={item._id} className={styles.card} onClick={() => onSelect(item._id)}>
      {count > 0 && (
        <div className={styles.counter_wrap}>
          <Counter count={count} size="default" />
        </div>
      )}

      <div className={styles.image_wrap}>
        <img src={item.image} alt={item.name} className={styles.image} />
      </div>

      <div className={styles.price_row}>
        <p className="text text_type_digits-default">{item.price}</p>
        <CurrencyIcon type="primary" />
      </div>

      <p className={`text text_type_main-small ${styles.title}`}>{item.name}</p>
    </li>
  );
}

export default IngredientCard;
