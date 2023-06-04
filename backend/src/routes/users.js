const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Payment = require('../models/Payment')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const Product = require('../models/Product')
const async = require('async')
global.crypto = require('crypto')

router.post('/register', async(req, res, next) => {
  try {
    const user = new User(req.body)
    await user.save()
    return res.sendStatus(200)
  } catch(error) {
    next(error)
  }
})

router.post('/login', async(req, res, next) => {
  // req.body password, email
  try {
    // 존재하는 유저인지 체크
    const user = await User.findOne({ email : req.body.email })

    if(!user) {
      return res.status(400).send("존재하지 않는 사용자 입니다.")
    }

    // 비밀번호가 올바른 것인지 체크
    const isMatch = await user.comparePassword(req.body.password)
    if(!isMatch) {
      return res.status(400).send("잘못된 비밀번호 입니다.")
    }

    const payload = {
      userId : user._id.toHexString()
    }
    // token을 생성
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn :  '1h'})

    return res.json({ user, accessToken })
  } catch(error) {
    next(error)
  }
})

router.get('/auth', auth, async(req, res, next) => {
  return res.json({
    id : req.user._id,
    email : req.user.email,
    name : req.user.name,
    role : req.user.role,
    image : req.user.image,
    cart : req.user.cart,
    history : req.user.history
  })
})

router.get('/logout', auth, async(req, res, next) => {
  try {
    return res.sendStatus(200)
  } catch(error) {
    next(error)
  }
})

router.post('/cart', auth, async(req, res, next) => {
  try {
    // 먼저 User Colllection에 해당 유저의 정보를 가져오기
    const userInfo = await User.findOne({ _id : req.user._id })

    // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인
    let duplicate = false
    userInfo.cart.forEach(item => {
      if(item.id === req.body.productId) {
        duplicate = true
      }
    })

    if(duplicate) {
      const user = await User.findByIdAndUpdate(
        { _id : req.user._id, "cart.id" : req.body.productId },  
        { $inc : { "cart.$.quantity" : 1 } }, 
        { new : true }
      )
      return res.status(201).send(user.cart)
    }

    // 상품이 이미 있지 않을 때
    else {
      const user = await User.findByIdAndUpdate(
        { _id : req.user._id },  
        { $push : {
            cart : {
              id : req.body.productId,
              quantity : 1,
              date : Date.now()
            }
          } 
        }, 
        { new : true }
      )
      return res.status(201).send(user.cart)
    }

  } catch(error) {
    next(error)
  }
})

router.delete('/cart', auth, async(req, res, next) => {
  try {
    // 먼저 cart 안에 내가 지우려고 한 상품을 지워주기
    const userInfo = await User.findOneAndUpdate(
      { _id : req.user._id },
      { 
        "$pull" : 
          { "cart" : { id : req.query.productId } }
      },
      { new : true }
      )

    const cart = userInfo.cart
    const array = cart.map(item => {
      return item.id
    })

    // product collection에서 현재 남아있는 상품들의 정보를 가져오기
    const productInfo = await Product
      .find({ _id : { $in : array } })
      .populate('writer')
    
    return res.status(200).json({
      productInfo,
      cart
    })

  } catch(error) {
    next(error)
  }
})

router.post('/payment', auth, async(req, res, next) => {
  // User Collection 안에 History 필드 안에 간단한 결제 정보 넣어주기
  let history = []
  let transactionData = {}

  req.body.cartDetail.forEach(item => {
    history.push({
      dateOfPurchase : new Date().toISOString(),
      name : item.title,
      id : item._id,
      price : item.price,
      quantity : item.quantity,
      paymentId : crypto.randomUUID()
    })
  })

  // Payment Collection 안에 자세한 결제 정보를 넣어주기
  transactionData.user = {
    id : req.user._id,
    name : req.user.name,
    email : req.user.email
  }

  transactionData.product = history

  // User Collection
  await User.findOneAndUpdate(
    { _id : req.user._id },
    { $push : { history : { $each : history}}, $set : { cart : []}}
  )

  // Payment Collection
  const payment = new Payment(transactionData)
  const paymentDocs = await payment.save()

  console.log(paymentDocs)

  let products = []
  paymentDocs.product.forEach(item => {
    products.push({ id : item.id, quantity : item.quantity })
  })

  async.eachSeries(products, async(item) => {
    await Product.updateOne(
      { _id : item.id },
      {
        $inc : {
          "sold" : item.quantity
        }
      }
    )
  },
  err => {
    if(err) return res.status(500).send(err)
    return res.sendStatus(200)
  })
})

module.exports = router;
