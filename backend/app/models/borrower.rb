class Borrower < ApplicationRecord
  has_many :invoices, dependent: :destroy
end