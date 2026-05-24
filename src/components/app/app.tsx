import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import BurgerIngredients from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/modal/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/modal/order-details';
import { API_BASE_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';
import type React from 'react';

import styles from './app.module.css';

type TConstructorItem = string;

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [constructorOrder, setConstructorOrder] = useState<TConstructorItem[]>([]);
  const [selectedBunId, setSelectedBunId] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isIngredientModalOpen, setIngredientModalOpen] = useState(false);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const loadIngredients = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response: Response = await fetch(`${API_BASE_URL}/ingredients`);
        if (!response.ok)
          throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);

        const body: TIngredientsResponse =
          (await response.json()) as TIngredientsResponse;
        if (!body?.success || !Array.isArray(body.data))
          throw new Error('Получены некорректные данные от сервера');

        if (isMounted) setIngredients(body.data);
      } catch (err) {
        if (!isMounted) return;
        const message =
          err instanceof Error
            ? err.message
            : 'Неизвестная ошибка при загрузке ингредиентов';
        setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadIngredients();

    return (): void => {
      isMounted = false;
    };
  }, []);

  const handleAddIngredient = (ingredientId: string): void => {
    const ingredient = ingredients.find((item) => item._id === ingredientId);
    if (!ingredient) return;

    if (ingredient.type === 'bun') {
      setSelectedBunId(ingredientId);
      return;
    }

    setConstructorOrder((prev) => [...prev, ingredientId]);
  };
  const handleAddIngredientAndClose = (ingredientId: string): void => {
    handleAddIngredient(ingredientId);
    setIngredientModalOpen(false);
    setSelectedIngredient(null);
  };
  const handleSelectIngredient = (ingredientId: string): void => {
    const ingredient = ingredients.find((item) => item._id === ingredientId);
    if (!ingredient) return;

    setSelectedIngredient(ingredient);
    setIngredientModalOpen(true);
  };
  const handleCloseIngredientModal = (): void => {
    setIngredientModalOpen(false);
    setSelectedIngredient(null);
  };

  const canOrder = selectedBunId !== null && constructorOrder.length > 0;

  const handleOpenOrderModal = (): void => {
    if (!canOrder) return;
    setOrderNumber(String(Math.floor(100000 + Math.random() * 900000)));
    setOrderModalOpen(true);
  };

  const handleCloseOrderModal = (): void => setOrderModalOpen(false);

  const handleRemoveIngredient = (index: number): void => {
    setConstructorOrder((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };
  const getIngredientCount = (ingredientId: string): number => {
    const ingredient = ingredients.find((item) => item._id === ingredientId);
    if (!ingredient) return 0;
    if (ingredient.type === 'bun') {
      return selectedBunId === ingredientId ? 1 : 0;
    }
    return constructorOrder.filter((item) => item === ingredientId).length;
  };
  const moveIngredient = (from: number, to: number): void => {
    setConstructorOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  if (isLoading) return <Preloader />;

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={styles.error_block}>
          <p className="text text_type_main-default">Ошибка загрузки ингредиентов:</p>
          <p className="text text_type_main-default">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>

        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients
            ingredients={ingredients}
            onSelectIngredient={handleSelectIngredient}
            getIngredientCount={getIngredientCount}
          />
          <BurgerConstructor
            ingredients={ingredients}
            constructorOrder={constructorOrder}
            selectedBunId={selectedBunId}
            onRemoveIngredient={handleRemoveIngredient}
            moveIngredient={moveIngredient}
            onOpenOrder={handleOpenOrderModal}
            canOrder={canOrder}
          />
        </main>

        {selectedIngredient && isIngredientModalOpen && (
          <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
            <IngredientDetails
              ingredient={selectedIngredient}
              onAdd={handleAddIngredientAndClose}
            />
          </Modal>
        )}

        {isOrderModalOpen && (
          <Modal title={`#${orderNumber}`} onClose={handleCloseOrderModal}>
            <OrderDetails orderNumber={orderNumber} />
          </Modal>
        )}
      </div>
    </DndProvider>
  );
};

export default App;
