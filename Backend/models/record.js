
import mongoose from 'mongoose'

const RECORD_TYPES = Object.freeze(['income', 'expense']);

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: {
        values: RECORD_TYPES,
        message: 'Type must be either "income" or "expense"',
      },
      required: [true, 'Type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [50, 'Category must be at most 50 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note must be at most 500 characters'],
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

recordSchema.index({ createdBy: 1, date: -1 }); 
recordSchema.index({ createdBy: 1, type: 1 });
recordSchema.index({ createdBy: 1, category: 1 });
recordSchema.index({ note: 'text' }); 

// Soft delete 
recordSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// query helper to exclude soft-deleted records
recordSchema.pre(/^find/, function (next) {
  if (this.getOptions().includeDeleted !== true) {
    this.where({ isDeleted: false });
  }
  next();
});

export const Record = mongoose.model('Record', recordSchema);
