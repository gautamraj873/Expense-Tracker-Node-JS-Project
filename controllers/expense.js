const path = require("path");
const Expense = require("../models/expense");
const User = require("../models/user");
const Download = require("../models/download");
const sequelize = require("../util/database");
const AWS = require('aws-sdk');

exports.getHomePage = async (req, res, next) => {
  try {
    res.sendFile(
      path.join(__dirname, "../", "public", "views", "homePage.html")
    );
  } catch (err) {
    console.log(err);
  }
};


exports.addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const date = req.body.date;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;

    await User.update(
      {
        totalExpenses: req.user.totalExpenses + Number(amount),
      },
      { where: { id: req.user.id } },
      { transaction: t }
    );

    await Expense.create(
      {
        date: date,
        category: category,
        description: description,
        amount: amount,
        userId: req.user.id,
      },
      { transaction: t }
    )
      .then((result) => {
        res.status(200);
        res.redirect("/homePage");
      })
      .catch((err) => {
        console.log(err);
      });
    await t.commit();
  } catch {
    async (err) => {
      await t.rollback();
      console.log(err);
    };
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.json(expenses);
  } catch (err) {
    console.log(err);
  }
};



exports.deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findByPk(id);
    await User.update(
      {
        totalExpenses: req.user.totalExpenses - expense.amount,
      },
      { where: { id: req.user.id } }
    );
    await Expense.destroy({ where: { id: id, userId: req.user.id } });
    res.redirect("/homePage");
  } catch (err) {
    console.log(err);
  }
};

exports.editExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;

    const expense = await Expense.findByPk(id);

    await User.update(
      {
        totalExpenses: req.user.totalExpenses - expense.amount + Number(amount),
      },
      { where: { id: req.user.id } }
    );

    await Expense.update(
      {
        category: category,
        description: description,
        amount: amount,
      },
      { where: { id: id, userId: req.user.id } }
    );

    res.redirect("/homePage");
  } catch (err) {
    console.log(err);
  }
};

exports.downloadExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await Expense.findAll({ where: { userId } });
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(stringifiedExpenses, filename, userId);
    res.status(200).json({fileUrl, success: true});
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  } 
}

async function uploadToS3(data, filename, userId) {
  const BUCKET_NAME = 'expensetracker1238';
  const IAM_USER_KEY = 'AKIAUBHCDCUK5KMX6JH2';
  const IAM_USER_SECRET = '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';

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  })

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
  }

  try {
    const s3response = await s3bucket.upload(params).promise();
    const fileUrl = s3response.Location;

    await Download.create({
      userId,
      fileUrl,
    });

    console.log('Upload Success:', s3response);
    return fileUrl;
  } catch (error) {
    console.error('Something went wrong:', error);
    throw error;
  }
}