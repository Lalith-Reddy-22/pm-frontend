import axiosClient from "./axiosClient";

/**
 * GET /api/v1/asset/all
 * Returns an array of asset objects:
 * { id, product_Name, brandName, product_Icon, p_Status, chkOption }
 *
 * p_Status: "A" = Available, anything else = In Use
 */
export async function getAllAssets() {
  const response = await axiosClient.get("/asset/all");
  return response.data;
}

/**
 * GET /api/v1/asset/my-requests?empId=<empId>
 * Returns the logged-in employee's asset request history.
 */
export async function getMyAssetRequests({ empId }) {
  const params = new URLSearchParams({ empId });
  const response = await axiosClient.get(`/asset/my-requests?${params}`);
  return response.data;
}

/**
 * POST /api/v1/asset/raise-request
 * Body: { empId: number, reason: string, productIds: number[] }
 */
export async function raiseAssetRequest({ empId, reason, productIds }) {
  const response = await axiosClient.post("/asset/raise-request", {
    empId: Number(empId),
    reason,
    productIds,
  });
  return response.data;
}

/**
 * GET /api/v1/asset/all-requests  (IT admin only)
 * Returns all asset requests across all employees.
 * Shape: { id, emp_Id, empName, request_Id, itemList, reason, status, request_RaisedDate, item_IssueDate, item_TakeBackDate }
 * status: 1 = Request, 2 = Issued, 3 = Returned
 */
export async function getAllAssetRequests() {
  const response = await axiosClient.get("/asset/all-requests");
  return response.data;
}

/**
 * PUT /api/v1/asset/update-status
 * Body: { reqId: string, status: number }
 * Updates the status of an asset request.
 */
export async function updateAssetRequestStatus({ reqId, status }) {
  // Backend expects only the numeric part — strip any leading alpha prefix (e.g. "MTHA5887" → "5887")
  const numericReqId = String(reqId).replace(/^[A-Za-z]+/, "");
  const response = await axiosClient.put("/asset/update-status", {
    reqId: numericReqId,
    status: Number(status),
  });
  return response.data;
}

/**
 * POST /api/v1/asset/add-asset
 * Body: { p_Id, product_Name, service_Number, storage, isActive }
 * Adds a new device to the asset inventory.
 */
export async function addAsset({ p_Id, product_Name, service_Number, storage, isActive }) {
  const response = await axiosClient.post("/asset/add-asset", {
    p_Id,
    product_Name,
    service_Number,
    storage,
    isActive,
  });
  return response.data;
}
