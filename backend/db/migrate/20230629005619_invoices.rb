class Invoices < ActiveRecord::Migration[7.0]
  def change
    add_column :invoices, :status, :string, default: 'created'
    add_index :invoices, :invoice_number, unique: true
  end
end