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

type TConstructorIngredient = TIngredient & {
  uniqueId: string;
};

type TBurgerConstructorProps = {
  ingredients: TConstructorIngredient[];
  selectedBun: TIngredient | null;
  onRemoveIngredient: (uniqueId: string) => void;
  moveIngredient: (from: number, to: number) => void;
  onOpenOrder: () => Promise<void>;
  canOrder: boolean;
  onAddIngredient: (ingredientId: string) => void;
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
  selectedBun,
  onRemoveIngredient,
  moveIngredient,
  onOpenOrder,
  canOrder,
  onAddIngredient,
}: TBurgerConstructorProps): React.JSX.Element => {
  const constructorItemsData = ingredients.filter((item) => item.type !== 'bun');

  const totalPrice =
    constructorItemsData.reduce((sum, item) => sum + item.price, 0) +
    (selectedBun ? selectedBun.price * 2 : 0);

  const topBunDropRef = useRef<HTMLDivElement>(null);
  const bottomBunDropRef = useRef<HTMLDivElement>(null);
  const ingredientsDropRef = useRef<HTMLUListElement>(null);

  const [, topBunDrop] = useDrop({
    accept: 'ingredient',
    drop(item: { ingredientId: string; type: string }) {
      if (item.type === 'bun') {
        onAddIngredient(item.ingredientId);
      }
    },
  });

  const [, bottomBunDrop] = useDrop({
    accept: 'ingredient',
    drop(item: { ingredientId: string; type: string }) {
      if (item.type === 'bun') {
        onAddIngredient(item.ingredientId);
      }
    },
  });

  const [, ingredientsDrop] = useDrop({
    accept: 'ingredient',
    drop(item: { ingredientId: string; type: string }) {
      if (item.type !== 'bun') {
        onAddIngredient(item.ingredientId);
      }
    },
  });

  topBunDrop(topBunDropRef);
  bottomBunDrop(bottomBunDropRef);
  ingredientsDrop(ingredientsDropRef);

  return (
    <section className={styles.burger_constructor}>
      <div ref={topBunDropRef}>
        {selectedBun ? (
          <ConstructorItem item={selectedBun} blocked />
        ) : (
          <div className={styles.placeholder}>Добавьте булку</div>
        )}
      </div>

      <div className={styles.scrollable_wrapper}>
        <ul ref={ingredientsDropRef} className={styles.constructor_list}>
          {constructorItemsData.length > 0 ? (
            constructorItemsData.map((item, index) => (
              <ConstructorItem
                key={`${item._id}-${index}`}
                item={item}
                index={index}
                onRemove={() => onRemoveIngredient(item.uniqueId)}
                moveIngredient={moveIngredient}
              />
            ))
          ) : (
            <div className={styles.placeholder}>Добавьте ингредиенты</div>
          )}
        </ul>
      </div>

      <div ref={bottomBunDropRef}>
        {selectedBun ? (
          <ConstructorItem item={selectedBun} blocked />
        ) : (
          <div className={styles.placeholder}>Добавьте булку</div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.total}>
          <p className="text text_type_digits-default">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
        <button
          type="button"
          className={`button button_type_primary button_size_medium ${styles.order_btn}`}
          onClick={() => void onOpenOrder()}
          disabled={!canOrder}
        >
          Оформить заказ
        </button>
      </div>
    </section>
  );
};
