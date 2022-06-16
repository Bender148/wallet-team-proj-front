import Button from '../Button'
import { useDispatch } from 'react-redux'
import { closeModalLogout } from '../../redux/globall/global-actions'
import { logOut } from '../../redux/session/session-operations'
import s from './ModalLogout.module.css'

export default function ModalLogout() {
  const dispatch = useDispatch()
  return (
    <>
      <div className={s.modalContainer}>
        <p className={s.text}>Ви впевнені?</p>
        <div className={s.buttonWrapper}>
          <Button
            onClick={() => dispatch(logOut())}
            title="Вийти"
            type="button"
            className={s.button}
          />
          <Button
            onClick={() => dispatch(closeModalLogout())}
            typeButton="secondary"
            title="Відміна"
            type="button"
            className={s.button}
          />
        </div>
      </div>
    </>
  )
}
