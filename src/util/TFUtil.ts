import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis'

import LabelData from '../data/labelData.json'
import LabelData2 from '../data/labelData2.json'
import LabelData3 from '../data/labelData3.json'

const modelName = "localstorage://number-model'"

class TFUtil {

  model: any = null
  construnct(){

  }

  getModel = async () => {
    try {
      let savedmodel = await tf.loadLayersModel(modelName);
      const optimizer = tf.train.adam();
      savedmodel.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
      });
      console.log("Use Saved Model")
      return savedmodel
    } catch (e){
      console.log("Create Model", e)
    }

    const model = tf.sequential();

    const IMAGE_WIDTH = 49;
    const IMAGE_HEIGHT = 50;
    const IMAGE_CHANNELS = 1;

    model.add(tf.layers.conv2d({
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }));

    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

    model.add(tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }));

    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

    model.add(tf.layers.flatten());

    const NUM_OUTPUT_CLASSES = 10;
    model.add(tf.layers.dense({
      units: NUM_OUTPUT_CLASSES,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'
    }));

    const optimizer = tf.train.adam();
    model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
    return model
  }

  train = async (model: any) => {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
      name: 'Model Training', tab: 'Model', styles: { height: '1000px' }
    };
    const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

    const BATCH_SIZE = 1000;

    const [trainXs, trainYs] = tf.tidy(() => {
      const dataCount = LabelData.length
      console.log("dataCount", dataCount)
      let ts = []
      let labels = []
      for (let i = 0; i < dataCount; i++) {
        ts.push(LabelData[i].data)
        labels.push(LabelData[i].label)
      }

      for (let i = 0; i < LabelData2.length; i++) {
        ts.push(LabelData[i].data)
        labels.push(LabelData[i].label)
      }

      for (let i = 0; i < LabelData3.length; i++) {
        ts.push(LabelData[i].data)
        labels.push(LabelData[i].label)
      }

      let tx = tf.tensor(ts)
      let ty = tf.oneHot(labels, 10)
      //tf.tensor(labels)

      tx = tx.reshape([dataCount * 3, 49, 50, 1])
      console.log("tx shape", tx.shape)
      console.log("ty shape", ty.shape)

      return [
        tx, ty
      ];
    });

    const [testXs, testYs] = tf.tidy(() => {
      let ts = []
      let labels = []
      let testCount = 20
      for (let i = 0; i < testCount; i++) {
        // let t = tf.tensor(LabelData[i].data).reshape([49, 50, 1])
        ts.push(LabelData[i].data)
        labels.push(LabelData[i].label)
      }
      let tx = tf.tensor(ts).reshape([testCount, 49, 50, 1])
      let ty = tf.oneHot(labels, 10)
      return [
        tx, ty
      ];
    });

    return model.fit(trainXs, trainYs, {
      batchSize: BATCH_SIZE,
      validationData: [testXs, testYs],
      epochs: 10,
      shuffle: true,
      callbacks: fitCallbacks
    });
  }

  predict = async (index: number) => {
    let model = await this.getModel()
    let ts = []
    let labels = []
    ts.push(LabelData[index].data)
    labels.push(LabelData[index].label)
    
    let tx = tf.tensor(ts).reshape([1, 49, 50, 1])
    let ty = tf.oneHot(labels, 10)
    let preds = model.predict(tx)
    console.log("preds", preds)
    let arg = (preds as any).argMax(-1)
    console.log("arg", arg)
    arg.print()
    let result = await arg.array()
    console.log("answer", result[0])
    console.log("Label", labels, ty)
    tx.dispose()
    ty.dispose()
    return result[0]
  }

  predictNumber = async (data: number[]) => {
    if (this.model === null) {
      this.model = await this.getModel()
    }
    let tx = tf.tensor(data).reshape([1, 49, 50, 1])
    let preds = this.model.predict(tx).argMax(-1)
    let result = await preds.array()
    tx.dispose()
    return result[0]
  }

  saveModel = async (model: any) => {
    await model.save(modelName)
  }
}

const shared = new TFUtil()

export default shared