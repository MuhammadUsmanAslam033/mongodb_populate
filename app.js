const mongoose = require('mongoose')
const { model, Schema } = mongoose

const app = require('express')()

mongoose.connect('mongodb://localhost:27017/populatedb', { useNewUrlParser: true })

const Department = model('department',
  new Schema({
    name: String,
    location: String
  }))

const Employee = model('employee',
  new Schema({
    firstName: String,
    lastName: String,
    mobile: String,
    department: { type: Schema.Types.ObjectId, ref: 'department' }
  }))

const Company = model('company',
  new Schema({
    name: String,
    address: String,
    employees: [{ type: Schema.Types.ObjectId, ref: 'employee' }]
  }))

app.use("/", async (req, res) => {

  await Department.remove({})
  await Department.create({
    name: 'CS Department',
    location: 'Biliding A'
  })
  await Department.create({
    name: 'CIVIL Department',
    location: 'Biliding B'
  })

  await Employee.remove({})
  await Employee.create({
    firstName: 'FAHAD',
    lastName: 'KHALID',
    mobile: '321-123-0001',
    department: await Department.findOne({ name: 'IT Department' })
  })
  await Employee.create({
    firstName: 'ALI',
    lastName: 'AHMAD',
    mobile: '321-123-0002',
    department: await Department.findOne({ name: 'Marketng Department' })
  })

  await Company.remove({})
  await Company.create({
    name: 'SVG LTD',
    address: 'Islamabad',
    employees: await Employee.find()
  })

  res.json({
    deartments: await Department.find(),
    employees: await Employee.find(),
    employeesWithDepartmentNested: await Employee.find().populate('department', 'name'),
    company: await Company.find(),
    companyWithEmployeesAndDepartmentsNested: 
      await Company.find()
        .populate(
          {
            path: 'employees', 
            model: 'employee', 
            populate: {
              path: 'department', 
              model: 'department'
            }
          }),
  })
})
app.listen(3000, () => console.log("running on 3000"))