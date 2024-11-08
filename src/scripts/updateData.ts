/* eslint-disable no-console */

import { FormData } from '../app/modules/formData/formData.model';

const Script = async () => {
  try {
    const allData = await FormData.find({ formId: '65ed2b6b6b18c81b4dd00fee' });
    console.log('Retrieved Data:', allData?.length);

    for (const data of allData) {
      // Parse the `data` field to modify the `Amount` field
      const parsedData = JSON.parse(data.data);

      // Convert `Amount` from string to number, if it’s a valid number
      if (!isNaN(parsedData.Amount)) {
        parsedData.Amount = Number(parsedData.Amount);
      } else {
        console.warn(`Invalid Amount value: ${parsedData.Amount}`);
        continue; // Skip this document if `Amount` isn't a valid number
      }

      // Update the document in the database
      await FormData.updateOne(
        { _id: data._id },
        {
          $set: {
            data: JSON.stringify(parsedData), // Save the updated `data` back as a JSON string
          },
        }
      );

      console.log(`Updated Amount for document with _id: ${data._id}`);
    }

    console.log('Amount field updated to number format for all documents.');
  } catch (error) {
    console.error('Error updating users:', error);
  }
};

export { Script };
