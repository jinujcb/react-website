using React_Store.Models;
using System;
using System.Data.Entity.Validation;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;

namespace React_Store.Controllers
{
    public class StoresController : Controller
    {
        StoreEntities db = new StoreEntities();

        public JsonResult GetAllStores()
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<Store> storelist = db.Stores.ToList();
            return Json(storelist, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetStore(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            Store storenew = db.Stores.Find(id);
            return Json(storenew, JsonRequestBehavior.AllowGet);

        }
        public ActionResult Index()
        {
            return View("Index");
        }

        [HttpPost]
        public ActionResult Create(Store store)
        {
            if (ModelState.IsValid)
            {
                db.Stores.Add(store);
                db.SaveChanges();
            }
            return View("Index");
        }

        [HttpPost]
        public ActionResult Edit(Store store)  // Update PartialView  
        {
            if (ModelState.IsValid)
            {
                Store storenew = db.Stores.Where(X => X.ID == store.ID).FirstOrDefault();
                if (storenew != null)
                {
                    storenew.ID = store.ID;
                    storenew.Name = store.Name;
                    storenew.Address = store.Address;
                    db.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            else
                return View(store);
        }


        [HttpPost]
        [ActionName("Delete")]
        public ActionResult DeleteEmployee(int id)  // Update PartialView  
        {
            if (ModelState.IsValid)
            {
                Store storenew = db.Stores.Where(X => X.ID == id).FirstOrDefault();
                if (storenew != null)
                {
                    db.Stores.Remove(storenew);
                    db.SaveChanges();
                }
            }
            return RedirectToAction("Index");
        }
    }
}