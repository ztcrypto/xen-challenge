class Invoice < ApplicationRecord
  validates :invoice_number, presence: true
  validates_uniqueness_of :invoice_number
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :due_date, presence: true

  belongs_to :borrower
end