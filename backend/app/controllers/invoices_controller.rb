class InvoicesController < ApplicationController
  def index
    invoices = Invoice.includes(:borrower)
    render json: invoices.to_json(include: :borrower)
  end

  def create
    invoice = Invoice.new(invoice_params)
    if invoice.save
      render json: invoice.to_json(include: :borrower)
    else
      render json: { error: invoice.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def next
    invoice = Invoice.find_by(id: params[:invoice_id])
    if invoice
      case invoice.status
        when "created"
          invoice.status = invoice.id.even? ? "approved" : "rejected"
        when "approved"
          invoice.status = "purchased"
        when "purchased"
          invoice.status = "closed"
      end
      if invoice.save
        render json: invoice.to_json(include: :borrower)
      else
        render json: { error: invoice.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: "Invoice not found" }, status: :not_found
    end
  end

  def delete
    invoice = Invoice.find_by(id: params[:invoice_id])
    if invoice
      invoice.destroy
      render json: { message: "Invoice deleted" }
    else
      render json: { error: "Invoice not found" }, status: :not_found
    end
  end

  private

  def invoice_params
    params.require(:invoice).permit(:amount, :invoice_number, :borrower_id, :due_date)
  end
end