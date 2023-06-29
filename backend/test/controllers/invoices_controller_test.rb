require 'test_helper'

class InvoicesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @invoice = invoices(:one)
  end

  test 'should get index' do
    get invoices_index_url
    assert_response :success
  end

  test 'should create invoice' do
    assert_difference('Invoice.count') do
      post invoices_create_url, params: { invoice: { amount: 300, invoice_number: "Invoice100", borrower_id: 4, due_date: "2023-07-23" } }
    end

    assert_response :success
    assert_equal 'created', Invoice.last.status
  end

  test 'should not create invoice with invalid parameters' do
    assert_no_difference('Invoice.count') do
      post invoices_create_url, params: { invoice: { invoice_number: "Invoice100" } }
    end

    assert_response :unprocessable_entity
    assert_match 'Amount can\'t be blank', response.body
  end

  test 'should update status to rejected when id is an odd number' do
    assert_no_difference('Invoice.count') do
      post invoices_next_url, params: { invoice_id: @invoice.id }
    end
    assert_response :success
    assert_equal 'rejected', @invoice.reload.status
  end

  test 'should update status to approved when id is an even number' do
    invoice = invoices(:two)
    assert_no_difference('Invoice.count') do
      post invoices_next_url, params: { invoice_id: invoice.id }
    end
    assert_response :success
    assert_equal 'approved', invoice.reload.status
  end

  test 'should update status to purchased' do
    invoice = invoices(:approved_invoice)

    assert_no_difference('Invoice.count') do
      post invoices_next_url, params: { invoice_id: invoice.id }
    end
    assert_response :success
    assert_equal 'purchased', invoice.reload.status
  end

  test 'should update status to closed' do
    invoice = invoices(:purchased_invoice)

    assert_no_difference('Invoice.count') do
      post invoices_next_url, params: { invoice_id: invoice.id }
    end
    assert_response :success
    assert_equal 'closed', invoice.reload.status
  end

  test 'should return error when invoice not found' do
    post invoices_next_url, params: { invoice_id: -1 }
    assert_response :not_found
    assert_match 'Invoice not found', response.body
  end

  test 'should delete invoice' do
    assert_difference('Invoice.count', -1) do
      delete invoices_delete_url, params: { invoice_id: @invoice.id }
    end

    assert_response :success
    assert_match 'Invoice deleted', response.body
  end

  test 'should return error when trying to delete non-existing invoice' do
    delete invoices_delete_url, params: { invoice_id: -1 }
    assert_response :not_found
    assert_match 'Invoice not found', response.body
  end
end