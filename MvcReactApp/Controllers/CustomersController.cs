using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MvcReactApp.Models;

namespace MvcReactApp.Controllers
{
    public class CustomersController : Controller
    {
        private readonly ProductStoreContext _context;

        // Get all customer names for dropdown list 
        public ActionResult GetCustomerList()
        {
            try
            {
                var cusList = (from x in _context.Customers
                               select new
                               {
                                   key = x.Id,
                                   text = x.Name,
                                   value = x.Id,
                               }).ToList();

                return Json(cusList);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get customer data 
        public ActionResult GetCustomerData()
        {

            var cusList = (from x in _context.Customers
                           select new
                           {
                               Id = x.Id,
                               Name = x.Name,
                               Address = x.Address
                           }).ToList();

            return Json(cusList);
        }

        //Get customer record by Id
        public ActionResult GetCustomerById(Customer cusId)
        {

            try
            {
                Customer customer = _context.Customers.Find(cusId.Id);
                return Json(customer);
            }

            catch (Exception ex)
            {
                throw ex;
            }

        }

        // Delete customer record by Id
        public ActionResult DeleteCustomerdata(Customer cusData)
        {
            try
            {
                Customer cus = _context.Customers.SingleOrDefault(x => x.Id == cusData.Id);
                _context.Customers.Remove(cus);
                _context.SaveChanges();
            }

            catch (Exception ex)
            {
                throw ex;
            }
            return Json(cusData);

        }
        
        //Save new or editted customer record 
        public ActionResult SaveCustomerdata(Customer cusData)
        {


            try
            {
                if (cusData.Id > 0)
                {
                    Customer cus = _context.Customers.SingleOrDefault(x => x.Id == cusData.Id);
                    cus.Name = cusData.Name;
                    cus.Address = cusData.Address;
                    _context.SaveChanges();


                }
                else
                {
                   Customer cus = new Customer();
                   cus.Name = cusData.Name;
                    cus.Address = cusData.Address;
                    _context.Customers.Add(cus);
                    _context.SaveChanges();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(cusData);

        }
        public CustomersController(ProductStoreContext context)
        {
            _context = context;
        }

        
    }
}
