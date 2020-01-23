using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MvcReactApp.Models;
using Newtonsoft.Json;

namespace MvcReactApp.Controllers
{
    public class SalesController : Controller
    {
        private readonly ProductStoreContext _context;

        // Get sales Data 
        public ActionResult GetSalesData()
        {
            try
            {
                var salesList = (from x in _context.Sales
                                 select new
                                 {
                                     Id = x.Id,
                                     ProductId = x.ProductId,
                                     ProductName = x.Product.Name,
                                     CustomerId = x.CustomerId,
                                     CustomerName = x.Customer.Name,
                                     StoreId = x.StoreId,
                                     StoreName = x.Store.Name,
                                     DateSold = x.DateSold.Day + "/" + x.DateSold.Month + "/" + x.DateSold.Year,
                                 }).ToList();
                return Json(salesList);

            }

            catch (Exception ex)
            {
                throw ex;
            }

        }

        // Get sales record by Id
        public ActionResult GetSalesById(Sales salesData)
        {
            try
            {
                var Editdata = (from x in _context.Sales
                                where (salesData.Id == x.Id)
                                select new
                                {
                                    Id = x.Id,
                                    CustomerName = x.Customer.Name,
                                    CustomerId = x.CustomerId,
                                    ProductName = x.Product.Name,
                                    ProductId = x.ProductId,
                                    StoreName = x.Store.Name,
                                    StoreId = x.StoreId,
                                    DateSold = x.DateSold.Day + "/" + x.DateSold.Month + "/" + x.DateSold.Year,
                                }).ToList();

                return Json(Editdata);
            }


            catch (Exception ex)
            {
                throw ex;
            }

            

        }

        //Save new or editted sales record
        public ActionResult SaveSalesData(Sales salesData)
        {
            try
            {
                if (salesData.Id > 0)
                {
                    Sales sales = _context.Sales.SingleOrDefault(x => x.Id == salesData.Id);
                    sales.ProductId = salesData.ProductId;
                    sales.CustomerId = salesData.CustomerId;
                    sales.StoreId = salesData.StoreId;
                    sales.DateSold = salesData.DateSold;
                    _context.SaveChanges();

                    return Json(new { success = true, message = "Data Saved Successfully." });

                }
                else
                {
                   Sales sales = new Sales();
                    sales.ProductId = salesData.ProductId;
                    sales.CustomerId = salesData.CustomerId;
                    sales.StoreId = salesData.StoreId;
                    sales.DateSold = salesData.DateSold;
                    _context.Sales.Add(sales);
                    _context.SaveChanges();
                    return Json(new { success = true, message = "Data Saved Successfully."});
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message= "Erorr occured" + ex });
            }

           
        }

        //Delete sales record by Id
        public ActionResult  DeleteSalesdata(Sales salesData)

        {
           
            try
            {
                Sales sales = _context.Sales.SingleOrDefault(x => x.Id == salesData.Id);
                _context.Sales.Remove(sales);
                _context.SaveChanges();
            }

            catch (Exception ex)
            {
                throw ex;
            }
            return Json(salesData);

        }


        public SalesController(ProductStoreContext context)
        {
            _context = context;
        }

       
    }
}
