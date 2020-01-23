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
    public class StoresController : Controller
    {
        private readonly ProductStoreContext _context;

        // Get Store data 
        public ActionResult GetStoreData()
        {

            var strList = (from x in _context.Stores
                           select new
                           {
                               Id = x.Id,
                               Name = x.Name,
                               Address = x.Address
                           }).ToList();

            return Json(strList);
        }

        // Get all store record by Id
        public ActionResult GetStoreById(Store strId)
        {

            try
            {
                Store store = _context.Stores.Find(strId.Id);
                return Json(store);
            }

            catch (Exception ex)
            {
                throw ex;
            }

        }

        // Delete store record by Id
        public ActionResult DeleteStoredata(Store strData)
        {
            try
            {
                Store str = _context.Stores.SingleOrDefault(x => x.Id == strData.Id);
                _context.Stores.Remove(str);
                _context.SaveChanges();
            }

            catch (Exception ex)
            {
                throw ex;
            }
            return Json(strData);

        }


        // Save new or editted store record 
        public ActionResult SaveStoredata(Store strData)
        {


            try
            {
                if (strData.Id > 0)
                {
                    Store str = _context.Stores.SingleOrDefault(x => x.Id == strData.Id);
                    str.Name = strData.Name;
                    str.Address = strData.Address;
                    _context.SaveChanges();


                }
                else
                {
                    Store str = new Store();
                    str.Name = strData.Name;
                    str.Address = strData.Address;
                    _context.Stores.Add(str);
                    _context.SaveChanges();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(strData);

        }

        // Get all store names for dropdown list 
        public ActionResult GetStoreList()
        {

            var storeList = (from x in _context.Stores
                           select new
                           {
                               key = x.Id,
                               text = x.Name,
                               value = x.Id,
                           }).ToList();

            return Json(storeList);
        }

        public StoresController(ProductStoreContext context)
        {
            _context = context;
        }

        
    }
}
