import React from 'react'
import { useForm } from 'react-hook-form' 
import ModalEditListForm from '../ModalEditListForm'

const EditTransition = ({ show, current, onSubmit, handleClose }) => {
  const { frames = 100, interval = 3, shutterSpeed = 200 } = current || {}
  const { errors, register, handleSubmit } = useForm()

  const modalProps = {
    show,
    ...!!current ? {
      onHide: handleClose
    } : {
        backdrop: 'static'
      }
  }

  const inputs = [[
    {
      label: 'Frames',
      placeholder: 'Frames',
      type: "number",
      name: 'frames',
      ref: register({
        required: 'This is required',
        min: 1,
        max: 1000
      }),
      defaultValue: frames
    },
    {
      label: 'Interval',
      placeholder: 'Interval',
      type: "number",
      name: 'interval',
      ref: register({
        required: 'This is required',
        min: 2,
        max: 20
      }),
      defaultValue: interval
    },
    {
      label: 'Shutter speed',
      placeholder: 'Shutter speed',
      type: "number",
      name: 'shutterSpeed',
      ref: register({
        required: 'This is required',
        min: 200
      }),
      defaultValue: shutterSpeed
    }
  ]]

  return (
    <ModalEditListForm
      title={`${!!current ? 'Edit' : 'New'} transition`}
      handleClose={!!current ? handleClose : null}
      onSubmit={handleSubmit(onSubmit)}
      fields={inputs}
      modal={modalProps}
      errors={errors}
    />
  )
}

export default EditTransition
