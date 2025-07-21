import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import bodyParser from "body-parser";

const categoryRouter = Router();
categoryRouter.use(bodyParser.json());

categoryRouter.post("/", categoryController.create);
categoryRouter.get("/", categoryController.getAll);
categoryRouter.put("/:id", categoryController.update);

export default categoryRouter;
