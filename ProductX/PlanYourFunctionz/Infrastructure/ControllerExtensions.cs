using Microsoft.AspNetCore.Mvc;
using eClaims.DTOs;

namespace eClaims.Infrastructure
{
    public static class ControllerExtensions
    {
        public static IActionResult OkResponse<T>(this ControllerBase controller, T data, string message = "Request successful", bool status = true)
        {
            return controller.Ok(new ApiResponse<T>
            {
                Success = status,
                Message = message,
                Data = data,
                Errors = null
            });
        }

        public static IActionResult OkResponse(this ControllerBase controller, bool status, string message = "Request successful")
        {
            return controller.Ok(new ApiResponse<object>
            {
                Success = status,
                Message = message,
                Data = null,
                Errors = null
            });
        }

        public static IActionResult NotFoundResponse(this ControllerBase controller, string message = "Resource not found")
        {
            return controller.NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = message,
                Data = null,
                Errors = null
            });
        }

        public static IActionResult InternalServerError(this ControllerBase controller, string message = "Internal server error")
        {
            return controller.StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = message,
                Data = null,
                Errors = null
            });
        }

        public static IActionResult BadRequestResponse(this ControllerBase controller, string message, object? errors = null)
        {
            return controller.BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = message,
                Data = null,
                Errors = errors
            });
        }

        public static IActionResult ConflictResponse(this ControllerBase controller, string message)
        {
            return controller.Conflict(new ApiResponse<object>
            {
                Success = false,
                Message = message,
                Data = null,
                Errors = null
            });
        }

        public static IActionResult UnauthorizedResponse(this ControllerBase controller, string message)
        {
            return controller.Unauthorized(new ApiResponse<object>
            {
                Success = false,
                Message = message,
                Data = null,
                Errors = null
            });
        }
    }
}
