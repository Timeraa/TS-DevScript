"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param stringArray The array of strings you want to outline
 * @param splitter The key of where it needs to outline to
 */
function outline(stringArray, splitter) {
    var highestLength = 0;
    //* Check if message length is higher then highestLength, if so set.
    stringArray.forEach(function (message) {
        if (message.includes(splitter) &&
            message.split(splitter)[0].length > highestLength)
            highestLength = message.split(splitter)[0].length;
    });
    //* Add spaces to the error messages to they match the highestLength.
    stringArray.forEach(function (message, index) {
        if (message.includes(splitter) &&
            message.split(splitter)[0].length !== highestLength) {
            var difference = highestLength - message.split(splitter)[0].length;
            var newMessage = message.split(splitter)[0];
            for (var i = 0; i < difference; i++) {
                newMessage += " ";
            }
            newMessage += splitter + message.split(splitter)[1];
            stringArray[index] = newMessage;
        }
    });
}
exports.default = outline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0bGluZVN0cmluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbC9mdW5jdGlvbnMvb3V0bGluZVN0cmluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7O0dBR0c7QUFDSCxTQUF3QixPQUFPLENBQUMsV0FBcUIsRUFBRSxRQUFnQjtJQUN0RSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDdEIsb0VBQW9FO0lBQ3BFLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPO1FBQzNCLElBQ0MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsYUFBYTtZQUVqRCxhQUFhLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFDSCxxRUFBcUU7SUFDckUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxLQUFLO1FBQ2xDLElBQ0MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssYUFBYSxFQUNsRDtZQUNELElBQU0sVUFBVSxHQUFHLGFBQWEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNyRSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLFVBQVUsSUFBSSxHQUFHLENBQUM7YUFDbEI7WUFDRCxVQUFVLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQztTQUNoQztJQUNGLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQXpCRCwwQkF5QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQHBhcmFtIHN0cmluZ0FycmF5IFRoZSBhcnJheSBvZiBzdHJpbmdzIHlvdSB3YW50IHRvIG91dGxpbmVcclxuICogQHBhcmFtIHNwbGl0dGVyIFRoZSBrZXkgb2Ygd2hlcmUgaXQgbmVlZHMgdG8gb3V0bGluZSB0b1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3V0bGluZShzdHJpbmdBcnJheTogc3RyaW5nW10sIHNwbGl0dGVyOiBzdHJpbmcpIHtcclxuXHRsZXQgaGlnaGVzdExlbmd0aCA9IDA7XHJcblx0Ly8qIENoZWNrIGlmIG1lc3NhZ2UgbGVuZ3RoIGlzIGhpZ2hlciB0aGVuIGhpZ2hlc3RMZW5ndGgsIGlmIHNvIHNldC5cclxuXHRzdHJpbmdBcnJheS5mb3JFYWNoKChtZXNzYWdlKSA9PiB7XHJcblx0XHRpZiAoXHJcblx0XHRcdG1lc3NhZ2UuaW5jbHVkZXMoc3BsaXR0ZXIpICYmXHJcblx0XHRcdG1lc3NhZ2Uuc3BsaXQoc3BsaXR0ZXIpWzBdLmxlbmd0aCA+IGhpZ2hlc3RMZW5ndGhcclxuXHRcdClcclxuXHRcdFx0aGlnaGVzdExlbmd0aCA9IG1lc3NhZ2Uuc3BsaXQoc3BsaXR0ZXIpWzBdLmxlbmd0aDtcclxuXHR9KTtcclxuXHQvLyogQWRkIHNwYWNlcyB0byB0aGUgZXJyb3IgbWVzc2FnZXMgdG8gdGhleSBtYXRjaCB0aGUgaGlnaGVzdExlbmd0aC5cclxuXHRzdHJpbmdBcnJheS5mb3JFYWNoKChtZXNzYWdlLCBpbmRleCkgPT4ge1xyXG5cdFx0aWYgKFxyXG5cdFx0XHRtZXNzYWdlLmluY2x1ZGVzKHNwbGl0dGVyKSAmJlxyXG5cdFx0XHRtZXNzYWdlLnNwbGl0KHNwbGl0dGVyKVswXS5sZW5ndGggIT09IGhpZ2hlc3RMZW5ndGhcclxuXHRcdCkge1xyXG5cdFx0XHRjb25zdCBkaWZmZXJlbmNlID0gaGlnaGVzdExlbmd0aCAtIG1lc3NhZ2Uuc3BsaXQoc3BsaXR0ZXIpWzBdLmxlbmd0aDtcclxuXHRcdFx0bGV0IG5ld01lc3NhZ2UgPSBtZXNzYWdlLnNwbGl0KHNwbGl0dGVyKVswXTtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmZXJlbmNlOyBpKyspIHtcclxuXHRcdFx0XHRuZXdNZXNzYWdlICs9IFwiIFwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdG5ld01lc3NhZ2UgKz0gc3BsaXR0ZXIgKyBtZXNzYWdlLnNwbGl0KHNwbGl0dGVyKVsxXTtcclxuXHRcdFx0c3RyaW5nQXJyYXlbaW5kZXhdID0gbmV3TWVzc2FnZTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG4iXX0=