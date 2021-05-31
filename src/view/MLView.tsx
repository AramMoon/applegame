import React from 'react'
import * as tf from '@tensorflow/tfjs';
import TFUtil from '../util/TFUtil'


import * as tfvis from '@tensorflow/tfjs-vis'

export default function MLView() {
  const run = async () => {
    let model = await TFUtil.getModel()
    tfvis.show.modelSummary({ name: 'Model Architecture', tab: 'Model' }, model);
    await TFUtil.train(model);
    await TFUtil.saveModel(model)
    console.log("End Training")
  } // End Run


  const predict = async () => {
    TFUtil.predict(169)
    // let t = tf.tensor([1,2,3])
    // let arr = await t.array()
    // console.log(arr)
  }

  return (
    <div>
      <button onClick={run}>Run</button>
      <button onClick={predict}>predict</button>
    </div>
  )
}
