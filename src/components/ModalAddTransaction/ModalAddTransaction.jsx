import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import Datetime from 'react-datetime'
import 'moment/locale/ru'
import Button from '../Button'
import { financeOperations, financeSelectors } from '../../redux/finance'
import { globalActions } from '../../redux/globall'
import { getCurrentDate, normalizeFormatDate } from '../../services'
import sprite from '../../assets/svg/sprite.svg'
import PluSvg from '../../assets/svg/Plus.svg'
import MinusSvg from '../../assets/svg/Minus.svg'
import { ReactSVG } from 'react-svg'
import 'react-datetime/css/react-datetime.css'
import styles from './ModalAddTransaction.module.css'

function ModalAddTransaction() {
  const [transactionType, setTransactionType] = useState('spending')
  const [selectedDate, setSelectedDate] = useState(null)
  const [categoriesMenu, setCategoriesMenu] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const categories = useSelector(financeSelectors.getCategories)
  const initialValues = {
    sum: '',
    comment: '',
  }

  const dispatch = useDispatch()

  const onSubmit = (values) => {
    const date = selectedDate
      ? `${selectedDate.getFullYear()}-${normalizeFormatDate(
          selectedDate.getMonth() + 1,
        )}-${normalizeFormatDate(selectedDate.getDate())}`
      : getCurrentDate()

    const transaction = {
      ...values,
      date,
      income: selectedCategory ? selectedCategory.income : false,
      category: selectedCategory ? selectedCategory.name : 'Разное',
    }

    dispatch(financeOperations.addTransaction(transaction))
    dispatch(financeOperations.getAllTransactions())
  }

  const changeCategory = (e, category) => {
    e.stopPropagation()
    setSelectedCategory(category)
    setCategoriesMenu(false)
  }

  const incomeActiveTrigger = () => {
    if (transactionType === 'income') {
      const basic = styles.transTypeText
      const active = styles.transTypeTextActiveIncome
      return `${basic} ${active}`
    }

    return styles.transTypeText
  }

  const spendingActiveTrigger = () => {
    if (transactionType === 'spending') {
      const basic = styles.transTypeText
      const active = styles.transTypeTextActiveSpending
      return `${basic} ${active}`
    }

    return styles.transTypeText
  }

  const switchToggle = () => {
    if (transactionType === 'income') {
      return styles.switchToggleIncome
    }

    return styles.switchToggleSpending
  }

  const switchClickHandler = () => {
    setTransactionType(transactionType === 'spending' ? 'income' : 'spending')
  }

  return (
    <div className={styles.addTransContainer}>
      {categoriesMenu && (
        <div
          className={styles.backdrop}
          onClick={() => {
            setCategoriesMenu(false)
          }}
        ></div>
      )}

      <div
        className={styles.closeBtnBox}
        onClick={() => dispatch(globalActions.closeModalAddTransaction())}
      >
        <button className={styles.closeButton}>
          <svg width="24" height="24" className={styles.closeIcon}>
            <use href={`${sprite}#icon-close`} />
          </svg>
        </button>
      </div>

      <h2 className={styles.title}>Добавить транзакцию</h2>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validateOnChange={false}
      >
        <Form className={styles.form}>
          <div className={styles.transTypeContainer}>
            <span className={incomeActiveTrigger()}>Доход</span>

            <div className={styles.switchToggleContainer}>
              <label
                className={styles.switchToggleBody}
                htmlFor="transType"
              ></label>
              <span className={switchToggle()}>
                <ReactSVG
                  className={styles.switchToggleSvg}
                  src={transactionType === 'income' ? PluSvg : MinusSvg}
                />
              </span>
            </div>

            <input
              className={styles.switchToggleInput}
              onChange={switchClickHandler}
              name="transactionType"
              type="checkbox"
              id="transType"
              defaultChecked
            />
            <span className={spendingActiveTrigger()}>Расход</span>
          </div>

          {transactionType === 'spending' && (
            <div
              className={styles.dropDownContainer}
              onClick={() => setCategoriesMenu(true)}
            >
              <div className={styles.dropDownField}>
                {selectedCategory ? (
                  <p className={styles.selectedCategory}>
                    {selectedCategory.name}
                  </p>
                ) : (
                  <p>Выберите категорию</p>
                )}
              </div>

              <svg className={styles.arowIcon}>
                <use href={`${sprite}#icon-arrow`} x={10}></use>
              </svg>

              {categoriesMenu && (
                <ul className={styles.dropDownList}>
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className={styles.dropDownItem}
                      onClick={(e) => changeCategory(e, category)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className={styles.summFieldContainer}>
            <Field
              className={styles.summField}
              required
              min="0.00"
              step="0.01"
              type="number"
              name="sum"
              placeholder="0.00"
            />
          </div>

          <div className={styles.calendarContainer}>
            <Datetime
              inputProps={{ className: styles.calendarField }}
              initialValue={getCurrentDate()}
              closeOnSelect={true}
              timeFormat={false}
              onChange={(e) => setSelectedDate(new Date(e))}
              dateFormat="YYYY-MM-DD"
            />
            <svg width="24" height="24" className={styles.calendarIcon}>
              <use href={`${sprite}#icon-calendar`} />
            </svg>
          </div>

          <div className={styles.commentFieldContainer}>
            <Field
              as="textarea"
              name="comment"
              className={styles.commentField}
              placeholder="Комментарий"
            />
          </div>

          <div className={styles.buttonsContainer}>
            <Button
              className={styles.submitButton}
              title="Добавить"
              type="submit"
            />

            <Button
              className={styles.cancelButton}
              title="Отмена"
              type="button"
              typeButton="secondary"
              onClick={() => dispatch(globalActions.closeModalAddTransaction())}
            />
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export default ModalAddTransaction
