import { useState } from 'react';
import classNames from 'classnames';
import styles from './filterItem.module.css';
import { getUniqueValuesByKey } from '@/utils/helper';
import { TrackType } from '@/sharedTypes/sharedTypes';

interface FilterItemProps {
  type: 'author' | 'year' | 'genre';
  tracks: TrackType[];
  onFilterChange: (type: 'author' | 'year' | 'genre', selected: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  activeFilter: 'author' | 'year' | 'genre' | null;
}

export default function FilterItem({ type, tracks, onFilterChange, isOpen, onToggle, activeFilter }: FilterItemProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleItemClick = (value: string) => {
    if (type === 'year') {
      // Для года — только один выбор
      setSelectedValues([value]);
      onFilterChange(type, [value]);
      onToggle(); // Закрываем окно
    } else {
      // Для автора и жанра — множественный выбор
      const newSelected = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelected);
      onFilterChange(type, newSelected);
    }
  };

  // Определяем элементы списка в зависимости от типа фильтра
  const items =
    type === 'year'
      ? ['По умолчанию', 'Сначала новые', 'Сначала старые']
      : getUniqueValuesByKey(tracks, type);

  return (
    <div className={styles.filter__item}>
      <div
        className={classNames(styles.filter__button, {
          [styles.persistent]: activeFilter === type || selectedValues.length > 0,
        })}
        onClick={onToggle}
      >
        {type === 'author' ? 'исполнителю' : type === 'year' ? 'году выпуска' : 'жанру'}
      </div>
      {isOpen && (
        <div className={styles.filter__dropdown}>
          <ul className={styles.filter__list}>
            {items.slice(0, 5).map((item) => (
              <li
                key={item}
                className={`${styles.filter__listItem} ${
                  selectedValues.includes(item) ? styles.filter__listItem_selected : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </li>
            ))}
            {items.length > 5 && (
              <li className={styles.filter__listItem}>
                <span>Прокрутите для просмотра</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}