import {
  CurrencyIcon,
  LockIcon,
  DeleteIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { TIngredient } from '@utils/types';
import type React from 'react';

import styles from './burger-constructor.module.css';

type TConstructorItem = string;

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  constructorOrder: TConstructorItem[];
  selectedBunId: string | null;
  onRemoveIngredient: (index: number) => void;
  moveIngredient: (from: number, to: number) => void;
  onOpenOrder: () => void;
  canOrder: boolean;
};

type TConstructorItemProps = {
  item: TIngredient;
  index?: number;
  blocked?: boolean;
  onRemove?: () => void;
  moveIngredient?: (from: number, to: number) => void;
};

const ConstructorItem = ({
  item,
  index,
  blocked,
  onRemove,
  moveIngredient,
}: TConstructorItemProps): React.JSX.Element => {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: 'constructorItem',
    hover(dragged: { index: number }) {
      if (dragged.index === undefined || index === undefined) return;
      if (dragged.index === index) return;
      if (!ref.current) return;
      moveIngredient?.(dragged.index, index);
      dragged.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'constructorItem',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`${styles.constructor_item} ${blocked ? styles.blocked : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {!blocked && (
        <div className={styles.drag_icon}>
          <DragIcon type={blocked ? 'secondary' : 'primary'} />
        </div>
      )}

      <div className={styles.item_inner}>
        <div className={styles.item_info}>
          <img src={item.image} alt={item.name} className={styles.item_image} />
          <p className="text text_type_main-default">{item.name}</p>
        </div>
        <div className={styles.price_row}>
          <p className="text text_type_digits-default">{item.price}</p>
          <CurrencyIcon type="primary" />
        </div>
        {!blocked && onRemove && (
          <button type="button" className={styles.delete_button} onClick={onRemove}>
            <DeleteIcon type="secondary" />
          </button>
        )}
        {blocked && (
          <div className={styles.locked_tag}>
            <LockIcon type="secondary" />
          </div>
        )}
      </div>
    </li>
  );
};

export const BurgerConstructor = ({
  ingredients,
  constructorOrder,
  selectedBunId,
  onRemoveIngredient,
  moveIngredient,
  onOpenOrder,
  canOrder,
}: TBurgerConstructorProps): React.JSX.Element => {
  const selectedBun = selectedBunId
    ? ingredients.find((i) => i._id === selectedBunId)
    : null;

  const constructorItemsData = constructorOrder
    .map((id) => ingredients.find((item) => item._id === id))
    .filter((item): item is TIngredient => !!item && item.type !== 'bun');

  const totalPrice =
    constructorItemsData.reduce((sum, item) => sum + item.price, 0) +
    (selectedBun ? selectedBun.price * 2 : 0);

  return (
    <section className={styles.burger_constructor}>
      {selectedBun && <ConstructorItem item={selectedBun} blocked />}

      <div className={styles.scrollable_wrapper}>
        <ul className={styles.constructor_list}>
          {constructorItemsData.map((item, index) => (
            <ConstructorItem
              key={`${item._id}-${index}`}
              item={item}
              index={index}
              onRemove={() => onRemoveIngredient(index)}
              moveIngredient={moveIngredient}
            />
          ))}
        </ul>
      </div>

      {selectedBun && <ConstructorItem item={selectedBun} blocked />}

      <div className={styles.footer}>
        <div className={styles.total}>
          <p className="text text_type_digits-default">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
        <button
          type="button"
          className={`button button_type_primary button_size_medium ${styles.order_btn}`}
          onClick={onOpenOrder}
          disabled={!canOrder}
        >
          Оформить заказ
        </button>
      </div>
    </section>
  );
};
