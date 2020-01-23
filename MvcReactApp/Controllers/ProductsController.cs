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
    public class ProductsController : Controller
    {
        private readonly ProductStoreContext _context;

        public ProductsController(ProductStoreContext context)
        {
            _context = context;
        }

       // Get product data
        public ActionResult GetProductData()
        {
            try{ var proList = (from x in _context.Products
                           select new
                           {
                               Id = x.Id,
                               Name = x.Name,
                               Price = x.Price,
                           }).ToList();

            return Json(proList);
        }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        // Get all product names for dropdown list 
        public ActionResult GetProductList()
        {
            try{ var proList = (from x in _context.Products
                           select new
                           {
                               key = x.Id,
                               text = x.Name,
                               value = x.Id,
                           }).ToList();

            return Json(proList);
        }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get product record by Id
        public ActionResult GetProductById(Product proId)
        {

            try
            {
                Product product = _context.Products.Find(proId.Id);
                return Json(product);
            }

            catch (Exception ex)
            {
                throw ex;
            }
           
        }

        //Save new or editted product record
        public ActionResult SaveProductdata(Product proData)
        {


            try
            {
                if (proData.Id > 0)
                {
                    Product pro = _context.Products.SingleOrDefault(x => x.Id == proData.Id);
                    pro.Name = proData.Name;
                    pro.Price = proData.Price;
                    _context.SaveChanges();


                }
                else
                {
                    Product pro = new Product();
                    pro.Name = proData.Name;
                    pro.Price = proData.Price;
                    _context.Products.Add(pro);
                    _context.SaveChanges();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(proData);

        }

        //Delete product record by Id
        public ActionResult DeleteProductdata(Product proData)
        {
            try
            {
                Product pro = _context.Products.SingleOrDefault(x => x.Id == proData.Id);
                _context.Products.Remove(pro);
                _context.SaveChanges();
            }

            catch (Exception ex)
            {
                throw ex;
            }
            return Json(proData);

        }

     
        
    }
}
