import { Router } from "express";
import { transactionController } from "../controllers/transactionController";
import bodyParser from "body-parser";
import { upload } from "../utils/convertPhoto";

const transactionRouter = Router();

transactionRouter.use(bodyParser.json({limit: '10mb'}));

transactionRouter.post("/", transactionController.create);
transactionRouter.get("/", transactionController.getAll);
transactionRouter.get("/summary", transactionController.getDashboardSummary);
transactionRouter.put("/:id", transactionController.update); 
transactionRouter.delete("/:id", transactionController.delete);
transactionRouter.post("/process-image", upload.single('image'), transactionController.getRecieptDetails);

export default transactionRouter;